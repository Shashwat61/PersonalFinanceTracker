import transactionService from "./transaction.service"
import authService from "./auth.service"
import watchEmailService from "./watch-email.service"
import userUpiDetailsService from "./user-upi-details.service"
import bankService from "./bank.service"
import userBankService from "./user-bank.service"
import userService from "./user.service"


const rootRouterService = () => {
    return {operational: true}
}

export default {
    rootRouterService,
    authService,
    transactionService,
    watchEmailService,
    userUpiDetailsService,
    bankService,
    userBankService,
    userService

}