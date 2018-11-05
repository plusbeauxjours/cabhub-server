import { Greeting } from '../../../types/graph';

const resolvers = {
    Query: {
        sayBye: () : Greeting => {
            return {
                error: true,
                text: "love you"
            }
        }
    }
}

export default resolvers;