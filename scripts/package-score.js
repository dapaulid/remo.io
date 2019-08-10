
const fs = require('fs');
const child_process = require('child_process');
const argparse = require('argparse');

function httpGET(url) {
    return new Promise((resolve, reject) => {

        const https = require('https');

        https.get(url, (resp) => {
            let data = '';
            resp.on('data', (chunk) => {
                data += chunk;
            });
            resp.on('end', () => {
                if (resp.statusCode == 200) {
                    resolve(JSON.parse(data));
                } else {
                    reject(JSON.parse(data));
                }
            });
        }).on("error", (err) => {
            reject(err);
        });

    });
}

function exec(cmd) {
    return new Promise((resolve, reject) => {
        child_process.exec(cmd, (err, stdout, stderr) => {
            if (err) {
                reject(err);
            } else {
                resolve(stdout.trim());
            }
        });
    });
}

function percent(x) {
    return Math.round(x * 100) + "%";
}

function output(name, value, comment) {
    console.log(name.padEnd(16) + ' : ' + ("" + value).padStart(12), comment ? '(' + comment + ')' : '');
}

function fail(message, err) {
    console.error("ERROR: " + message + ":", err.message || err);
    process.exit(1);
}

function getPackageName() {
    const pkg = require('../package.json');
    return pkg.name;
}

// main
(async () => {

    const parser = new argparse.ArgumentParser({
      version: '0.0.1',
      addHelp:true,
      description: 'npm package score script'
    });
    parser.addArgument('package', {
        nargs: '?',
        help: 'name of package to score'
    });    
    parser.addArgument(['-s', '--save-report'], {
        action: 'storeTrue',
        help: 'save report to file'
    });
    const args = parser.parseArgs();

    // get package name
    const package_name = args.package || getPackageName();

    // get package score from https://npms.io
    const query = "https://api.npms.io/v2/package/" + package_name;
    let score;
    try {
        score = await httpGET(query);
    } catch (err) {
        fail("failed to get package score", err);
    }

    // save report
    if (args.save_report) {
        const report = { query, result: score };
        fs.writeFileSync('reports/package-score.json', JSON.stringify(report, null, 2), 'utf-8');
    }

    output("package", package_name);
    const analyzed_at = new Date(score.analyzedAt);
    output("analyzed on", analyzed_at.toLocaleDateString());
    output("analyzed at", analyzed_at.toLocaleTimeString());

    // get published package version from npm
    let published_version;
    try {
        published_version = await exec("npm show " + package_name + " version");
    } catch (err) {
        fail("failed to get published package version", err);
    }

    // check version
    const rated_version = score.collected.metadata.version;
    const outdated = rated_version != published_version;
    output("up-to-date", outdated ? "no" : "yes", 
        outdated ? ("published version: " + published_version + ", rated: " + rated_version) : undefined);

    console.log("-------------------------------");
    const npm = score.collected.npm;
    output("npm weekly dl", npm.downloads[1].count);
    output("npm dependents", npm.dependentsCount);
    output("npm stars", npm.starsCount);
    
    const github = score.collected.github;
    output("GitHub forks", github ? github.forksCount : '-');
    output("GitHub stars", github ? github.starsCount : '-');

    console.log("-------------------------------");
    output("quality", percent(score.score.detail.quality));
    output("popularity", percent(score.score.detail.popularity));
    output("maintenance", percent(score.score.detail.maintenance));
    console.log("===============================");
    output("total score", percent(score.score.final), outdated && "outdated!");
    console.log("===============================");
})();

