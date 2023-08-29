import {app} from "@/app";
import {DatabaseManager} from "@/db";

export const runServer = (): void => {
  const port = process.env.PORT || 8000;

  const server = app.listen(port, () => {
  });

  const shutDown = async (): Promise<void> => {
    await new DatabaseManager().close();
    server.close(() => {
      process.exit(0);
    });
  };

  process.on("SIGTERM", shutDown);
  process.on("SIGINT", shutDown);
};
