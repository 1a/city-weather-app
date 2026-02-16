import type { Request, Response, NextFunction } from "express";
// I would normally use a library like Joi or Zod for this kind of validation, but for this simple example manual validation is fine.
export function validateCreateCity(req: Request, res: Response, next: NextFunction) {
  const { name, state, country, touristRating, dateEstablished, estimatedPopulation } = req.body;
  const errors: string[] = [];

  if (!name || typeof name !== "string") errors.push("name is required");
  if (!state || typeof state !== "string") errors.push("state is required");
  if (!country || typeof country !== "string") errors.push("country is required");
  if (!Number.isInteger(touristRating) || touristRating < 1 || touristRating > 5)
    errors.push("touristRating must be an integer between 1 and 5");
  if (!dateEstablished || typeof dateEstablished !== "string")
    errors.push("dateEstablished is required");
  if (!Number.isInteger(estimatedPopulation) || estimatedPopulation < 0)
    errors.push("estimatedPopulation must be a non-negative integer");

  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }
  next();
}

export function validateUpdateCity(req: Request, res: Response, next: NextFunction) {
  const { touristRating, dateEstablished, estimatedPopulation } = req.body;
  const errors: string[] = [];

  if (touristRating !== undefined && (!Number.isInteger(touristRating) || touristRating < 1 || touristRating > 5))
    errors.push("touristRating must be an integer between 1 and 5");
  if (dateEstablished !== undefined && typeof dateEstablished !== "string")
    errors.push("dateEstablished must be a string");
  if (estimatedPopulation !== undefined && (!Number.isInteger(estimatedPopulation) || estimatedPopulation < 0))
    errors.push("estimatedPopulation must be a non-negative integer");

  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }
  next();
}
