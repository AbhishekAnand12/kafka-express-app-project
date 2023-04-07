import fs from 'fs';

interface Config {
  [key: string]: string;
}

export const readConfigFile=(fileName: string): Config =>{
  const data: string[] = fs.readFileSync(fileName, 'utf8').toString().split('\n');
  return data.reduce((config: Config, line: string) => {
    const [key, value]: string[] = line.split('=');
    if (key && value) {
      config[key] = value;
    }
    return config;
  }, {});
}
