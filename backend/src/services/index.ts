import transactionService from "./transaction.service"
import userService from "./auth.service"
import bankEmailService from "./bank-email.service"


const rootRouterService = () => {
    return {operational: true}
}

export default {
    rootRouterService,
    userService,
    transactionService,
    bankEmailService

}