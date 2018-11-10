import { Resolvers } from '../../../types/resolvers';
import { CompletePhoneVerificationMutationArgs, CompletePhoneVerificationResponse } from '../../../types/graph';

const resolvers: Resolvers = {
    Mutation: {
        CompletePhoneVerification: async (
            _,
            args: CompletePhoneVerificationMutationArgs
        ): Promise<CompletePhoneVerificationResponse> => {
            const { phoneNumber } = args;
            try {

            } catch (error) {
                return {
                    ok: false,
                    error: error.message,
                    token: null
                }
            }
        }
    }
}

export default resolvers;