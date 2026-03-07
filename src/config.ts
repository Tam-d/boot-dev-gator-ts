import os from "node:os"
import fs from "fs"
import path from "path"

export type Config = {
    dbUrl: string,
    currentUserName: string
};

export function setUser(username : string) {
    let config = readConfig();
    config.currentUserName = username;
    writeConfig(config);
}

export function readConfig(): Config{
    try {
        let data = fs.readFileSync(getConfigFilePath(), 'utf8');
        return validateConfig(data);
    }
    catch(e) {
        throw Error(`Unable to read ${getConfigFilePath}: ${(e as Error).message}`)
    }
}

function getConfigFilePath(): string {
    return path.join(os.homedir(), `.gatorconfig.json`);
}

function writeConfig(cfg: Config): void {
    try {
        fs.writeFileSync(
            getConfigFilePath(), 
            JSON.stringify({"db_url": cfg.dbUrl, "current_user_name": cfg.currentUserName})
        );
    }
    catch(e) {
        throw Error(`Unable to write to ${getConfigFilePath()}: ${(e as Error).message}`);
    }

}

function validateConfig(rawConfig: any): Config {
    let configJSON = JSON.parse(rawConfig.toString());

    return {
        dbUrl: configJSON["db_url"],
        currentUserName: configJSON["current_user_name"]
    }
}