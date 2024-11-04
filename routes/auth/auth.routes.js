import { Router } from 'express';
import { userLogin, userRegister } from '../../controllers/auth/auth.controllers.js';
import { registerValidation } from '../../utils/validations/user.register.validation.js';
import { loginValidation } from '../../utils/validations/user.login.validation.js';
const authRouter = Router();

authRouter.post('/register', registerValidation, userRegister);

authRouter.post('/login', loginValidation, userLogin);

export default authRouter;
