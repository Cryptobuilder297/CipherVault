import { Router, type IRouter } from "express";
import healthRouter from "./health";
import marketRouter from "./market";
import holdingsRouter from "./holdings";
import portfolioRouter from "./portfolio";
import transactionsRouter from "./transactions";
import watchlistRouter from "./watchlist";

const router: IRouter = Router();

router.use(healthRouter);
router.use(marketRouter);
router.use(holdingsRouter);
router.use(portfolioRouter);
router.use(transactionsRouter);
router.use(watchlistRouter);

export default router;
