import express from "express";
export const followRouter = express.Router();

export const errRouter = express.Router();

errRouter.use((req, res) => {
  res
    .status(404)
    .send(
      '<body style="margin: 0; background: #000; color: #fff"><div style="display: flex;align-items: center; justify-content: center; height: 90vh;font-family: Arial, sans-serif;"><div><h1 style="font-size: 45px">Not Found</h1>  </div></div></body>'
    );
});
