import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolvers";
import { 
    UpdateMyProfileMutationArgs, 
    UpdateMyProfileResponse 
} from '../../../types/graph';
import User from "../../../entities/User";

const resolvers: Resolvers = {
    Mutation: {
        UpdateMyProfile: privateResolver(
            async(
                _,
                args: UpdateMyProfileMutationArgs,
                { req }
            ): Promise<UpdateMyProfileResponse> => {
                const user: User = req.user
                await User.update({ id: user.id }, { ...args });
                console.log({req})
            }
        )
    }
}

export default resolvers;