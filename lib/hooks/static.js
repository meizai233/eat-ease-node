export default async (app) => {
  app.use(express.static("@root/public"));
};
