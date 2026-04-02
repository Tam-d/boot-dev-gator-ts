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
    console.log(`The username, ${username}, has been set`);
}

export function readConfig(): Config{
    try {
        let data = fs.readFileSync(getConfigFilePath(), 'utf8');
        return validateConfig(JSON.parse(data));
    }
    catch(e) {
        throw Error(`Unable to read ${getConfigFilePath()}: ${(e as Error).message}`)
    }
}

function getConfigFilePath(): string {
    return path.join(os.homedir(), `.gatorconfig.json`);
}

function writeConfig(cfg: Config): void {
    try {
        fs.writeFileSync(
            getConfigFilePath(), 
            JSON.stringify({
                "db_url": cfg.dbUrl, 
                "current_user_name": cfg.currentUserName
            }, null, 2)
        );
    }
    catch(e) {
        throw Error(`Unable to write to ${getConfigFilePath()}: ${(e as Error).message}`);
    }

}

function validateConfig(rawConfig: any): Config {
    if(!rawConfig.db_url || typeof rawConfig.db_url !== "string") {
        throw new Error("db_url is required in config file");
    }
    if(!rawConfig.current_user_name ||
        typeof rawConfig.current_user_name !== "string") {
        throw new Error("current_user_name is required in config file");
    }

    return {
        dbUrl: rawConfig.db_url,
        currentUserName: rawConfig.current_user_name
    }
}