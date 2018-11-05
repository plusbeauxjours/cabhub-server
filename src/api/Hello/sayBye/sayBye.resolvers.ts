import { SayByeResponse, SayByeQueryArgs } from '../../../types/graph';

const resolvers = {
    Query: {
        sayBye: (_, args: SayByeQueryArgs) : SayByeResponse => {
            return {
                error: true,
                text: `Hello ${args.name}`
            }
        }
    }
}

export default resolvers;