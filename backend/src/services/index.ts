import transactionService from "./transaction.service"
import userService from "./auth.service"


const rootRouterService = () => {
    return {operational: true}
}

export default {
    rootRouterService,
    userService,
    transactionService

}