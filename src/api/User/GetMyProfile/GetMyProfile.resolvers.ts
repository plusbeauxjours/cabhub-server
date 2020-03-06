import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";

const resolvers: Resolvers = {
  Query: {
    GetMyProfile: privateResolver(async (_, __, { req }) => {
      const { user } = req;
      console.log(user);
      return {
        ok: true,
        error: null,
        user
      };
    })
  }
};

export default resolvers;
