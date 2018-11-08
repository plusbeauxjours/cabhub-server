import { Resolvers } from '../../../types/resolvers';
import { 
    FacebookConnectMutationArgs, 
    FacebookConnectResponse 
} from '../../../types/graph';
import User from '../../../entities/User';

const resolvers: Resolvers = {
  Mutation: {
    FacebookConnect: async(
        _,
        args: FacebookConnectMutationArgs
    ): Promise<FacebookConnectResponse> => {
        const { fbId } = args;
        try {
            const existingUser = await User.findOne({ fbId });
            if (existingUser) {
                return {
                    ok: true,
                    error: null,
                    token: "Coming soon"
                }    
            }  
        } catch (error) {
            return {
                ok: false,
                error: error.message,
                token: null
            };
        }
        try {
            await User.create({
                ...args,
                profilePhoto: `https://avatars3.githubusercontent.com/u/12480618?s=400&u=14fb78618f64f0335191ecc8614ddfc2b52a9233&v=4`
            }).save();
            return {
                ok: true,
                error: null,
                token: "Coming soon"
            }
        } catch (error) {
            return {
                ok: false,
                error: error.message,
                token: null
            }
        }
    }
  }
};

export default resolvers;