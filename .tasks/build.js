"use strict";
const gulp = require("gulp"),
    requireUncached = require("require-uncached"),
    typescript = require("gulp-typescript"),
    config = require("./@configuration.js"),
    merge = require("merge2"),
    rename = require("gulp-rename"),
    resx2 = require("gulp-resx2"),
    xml2json = require("gulp-xml2json"),
    sourcemaps = require("gulp-sourcemaps"),
    spcs = require("gulp-spcolor-stylus"),
    replace = require("gulp-replace"),
    flatmap = require("gulp-flatmap"),
    fs = require("fs"),
    es = require("event-stream"),
    path = require("path"),
    runSequence = require("run-sequence"),
    powershell = require("./utils/powershell.js"),
    git = require("./utils/git.js"),
    file = require("./utils/file.js"),
    format = require("string-format"),
    pkg = require("../package.json");

//#region Helpers
function replaceVersionToken(hash) {
    return replace(config.versionToken, format("{0}.{1}", pkg.version, hash));
}
//#endregion

gulp.task("buildLib", ["copyResourcesToLib", "tsLint"], () => {
    const project = typescript.createProject("tsconfig.json", { declaration: true });
    const built = gulp.src(config.globs.js).pipe(project(typescript.reporter.fullReporter()));
    return merge([built.dts.pipe(gulp.dest(config.paths.lib)), built.js.pipe(gulp.dest(config.paths.lib))]);
});

gulp.task("buildJsonResources", () => {
    return gulp.src(config.globs.resx)
        .pipe(resx2())
        .pipe(rename({extname: ".json"}))
        .pipe(gulp.dest(path.join(config.paths.source, "js", "Resources")));
});

gulp.task("buildJsonPreferences", () => {
    return gulp.src(config.globs.preferences)
        .pipe(xml2json())
        .pipe(rename({extname: ".json"}))
        .pipe(gulp.dest(path.join(config.paths.source, "js", "Preferences")));
});

gulp.task("buildTheme", () => {
    return gulp.src(config.globs.theme)
        .pipe(spcs())
        .pipe(rename(path => { path.extname += ".styl" }))
        .pipe(gulp.dest(path.join(config.paths.source, "css", "conf")));
});


gulp.task("stampVersionToTemplates", done => {
    const src = gulp.src(path.join(config.paths.templatesTemp, "**", "*.xml"));
    git.hash(hash => {
        es.concat(src.pipe(flatmap((stream, file) => {
            return stream
                .pipe(replaceVersionToken(hash))
                .pipe(gulp.dest(config.paths.templatesTemp))
        }))).on("end", done);
    });
});

gulp.task("stampVersionToScripts", done => {
    const src = gulp.src(path.join(config.paths.dist, "*.ps1"));
    git.hash(hash => {
        es.concat(src.pipe(flatmap((stream, file) => {
            return stream
                .pipe(replaceVersionToken(hash))
                .pipe(gulp.dest(config.paths.dist))
        }))).on("end", done);
    });
});

gulp.task("convertPnpTemplates", done => {
    powershell.execute("Build-PnP-Templates.ps1", "")
        .then(() => {
            done();
        })
        .catch(err => {
            done(err);
        });
});

function getTemplateJson(tmpl, lcid) {
    const jsPath = format("../lib/Provision/Template/_/{0}.js", tmpl);
    global._spPageContextInfo = { webLanguage: lcid };
    const tmplJs = require(jsPath).default;
    return JSON.stringify(tmplJs);
}

function _buildSiteTemplate(lcid) {
    return new Promise((resolve, reject) => {
        const files = [];
        const filepath = path.join(__dirname, "../_templates", "root-{0}", "SiteTemplates", "{1}.txt");
        config.siteTemplates.forEach(tmpl => {
            files.push({
                path: format(filepath, lcid.toString(), tmpl),
                contents: getTemplateJson(tmpl, lcid),
            });
        });
        Promise.all(files.map(f => file.write(f.path, f.contents))).then(resolve, reject);
    });
}

gulp.task("buildSiteTemplates", done => {
    const argv = require("yargs").argv;
    if (argv.lcid) {
        _buildSiteTemplate(argv.lcid).then(() => {
            done();
        });
    } else {
        done("Argument lcid not specified");
    }
});
