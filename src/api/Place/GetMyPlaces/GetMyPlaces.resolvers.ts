import User from "../../../entities/User";
import { GetMyPlacesResponse } from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";
import { getRepository } from "typeorm";

const resolvers: Resolvers = {
  Query: {
    GetMyPlaces: privateResolver(
      async (_, __, { req }): Promise<GetMyPlacesResponse> => {
        try {
          const user = await getRepository(User).findOne(
            { id: req.user.id },
            { relations: ["places"] }
          );
          if (user) {
            return {
              ok: true,
              places: user.places,
              error: null
            };
          } else {
            return {
              ok: false,
              places: null,
              error: "User not found"
            };
          }
        } catch (error) {
          return {
            ok: false,
            error: error.message,
            places: null
          };
        }
      }
    )
  }
};

export default resolvers;
