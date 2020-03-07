import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";
import { GetMyRidesResponse } from "../../../types/graph";
import User from "../../../entities/User";
import { getRepository } from "typeorm";

const resolvers: Resolvers = {
  Query: {
    GetMyRides: privateResolver(
      async (_, __, { req }): Promise<GetMyRidesResponse> => {
        const user: User = req.user;

        if (user.isDriving) {
          try {
            const user = await getRepository(User).findOne(
              { id: req.user.id },
              { relations: ["ridesAsDriver"] }
            );
            if (user) {
              return {
                ok: true,
                error: null,
                rides: user.ridesAsDriver
              };
            } else {
              return {
                ok: false,
                error: "Ride not found",
                rides: null
              };
            }
          } catch (error) {
            return {
              ok: false,
              error: error.message,
              rides: null
            };
          }
        } else {
          try {
            const user = await getRepository(User).findOne(
              { id: req.user.id },
              { relations: ["ridesAsPassenger"] }
            );
            if (user) {
              return {
                ok: true,
                error: null,
                rides: user.ridesAsPassenger
              };
            } else {
              return {
                ok: false,
                error: "Ride not found",
                rides: null
              };
            }
          } catch (error) {
            return {
              ok: false,
              error: error.message,
              rides: null
            };
          }
        }
      }
    )
  }
};

export default resolvers;
