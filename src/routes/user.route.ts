import { Router } from "express";
import {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} from "../controllers";
import { CreateUserDto, UpdateUserDto } from "../dto";
import {
  protect,
  restrictTo,
  isOwnerOrAdmin,
  validateRequest,
} from "../middleware";
import { UserRole } from "../models";

const router = Router();

router.use(protect);

router
  .route("/")
  .get(restrictTo(UserRole.ADMIN), getUsers)
  .post(restrictTo(UserRole.ADMIN), validateRequest({ body: CreateUserDto }), createUser);

router
  .route("/:id")
  .get(isOwnerOrAdmin, getUser)
  .patch(isOwnerOrAdmin, validateRequest({ body: UpdateUserDto }), updateUser)
  .delete(isOwnerOrAdmin, deleteUser);

export default router;
