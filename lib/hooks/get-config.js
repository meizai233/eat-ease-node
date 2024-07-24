import configLite from "config-lite";

export default function (app) {
  const config = configLite(__dirname).default;
  app.config = config;
}
