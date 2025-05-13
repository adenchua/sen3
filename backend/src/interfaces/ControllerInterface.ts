import { Response, Request } from "express";
import { ValidationChain } from "express-validator";

export default interface ControllerInterface {
  controller: (req: Request, res: Response) => Promise<void>;
  validator: ValidationChain[];
}
