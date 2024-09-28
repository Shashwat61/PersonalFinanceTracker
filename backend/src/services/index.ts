import transactionService from "./transaction.service"
import userService from "./auth.service"
import watchEmailService from "./watch-email.service"
import userUpiDetailsService from "./user-upi-details.service"
import bankService from "./bank.service"
import userBankService from "./user-bank.service"


const rootRouterService = () => {
    return {operational: true}
}

export default {
    rootRouterService,
    userService,
    transactionService,
    watchEmailService,
    userUpiDetailsService,
    bankService,
    userBankService

}