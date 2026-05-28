import { Router, type IRouter } from "express";
import healthRouter from "./health";
import marketRouter from "./market";
import holdingsRouter from "./holdings";
import portfolioRouter from "./portfolio";
import transactionsRouter from "./transactions";
import watchlistRouter from "./watchlist";
import usersRouter from "./users";
import depositsRouter from "./deposits";
import withdrawalsRouter from "./withdrawals";
import plansRouter from "./plans";
import investmentsRouter from "./investments";
import adminRouter from "./admin";
import referralsRouter from "./referrals";

const router: IRouter = Router();

router.use(healthRouter);
router.use(marketRouter);
router.use(holdingsRouter);
router.use(portfolioRouter);
router.use(transactionsRouter);
router.use(watchlistRouter);
router.use(usersRouter);
router.use(depositsRouter);
router.use(withdrawalsRouter);
router.use(plansRouter);
router.use(investmentsRouter);
router.use(adminRouter);
router.use(referralsRouter);

export default router;
