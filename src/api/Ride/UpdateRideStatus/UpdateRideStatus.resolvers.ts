import Chat from "../../../entities/Chat";
import Ride from "../../../entities/Ride";
import User from "../../../entities/User";
import {
  UpdateRideStatusMutationArgs,
  UpdateRideStatusResponse
} from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";
import { getRepository } from "typeorm";

const resolvers: Resolvers = {
  Mutation: {
    UpdateRideStatus: privateResolver(
      async (
        _,
        args: UpdateRideStatusMutationArgs,
        { req, pubSub }
      ): Promise<UpdateRideStatusResponse> => {
        const user: User = req.user;
        if (user.isDriving) {
          try {
            let ride: Ride | undefined;
            if (args.status === "ACCEPTED") {
              ride = await getRepository(Ride).findOne(
                {
                  id: args.rideId,
                  status: "REQUESTING"
                },
                { relations: ["passenger"] }
              );
              if (ride) {
                ride.driver = user;
                user.isTaken = true;
                user.save();
                console.log("ride when get accepted", ride);
                const chat = await Chat.create({
                  driver: user,
                  passenger: ride.passenger
                }).save();
                console.log("chat when get accepted", chat);
                ride.chat = chat;
                ride.save();
              }
            } else {
              ride = await getRepository(Ride).findOne(
                {
                  id: args.rideId,
                  driver: user
                },
                { relations: ["passenger"] }
              );
            }
            if (ride) {
              ride.status = args.status;
              ride.passenger.isRiding = false;
              ride.passenger.save();
              ride.save();
              pubSub.publish("rideUpdate", { RideStatusSubscription: ride });
              return {
                ok: true,
                error: null,
                rideId: args.rideId
              };
            } else {
              return {
                ok: false,
                error: "Cant update ride",
                rideId: args.rideId
              };
            }
          } catch (error) {
            return {
              ok: false,
              error: error.message,
              rideId: args.rideId
            };
          }
        } else if (user.isRiding) {
          try {
            if (args.status === "CANCELED") {
              const ride = await getRepository(Ride).findOne({ id: 28 });
              // const ride = await getRepository(Ride).findOne(
              //   {
              //     passengerId: user.id,
              //     status: "REQUESTING"
              //   },
              //   { relations: ["passenger"] }
              // );
              if (ride) {
                ride.remove();
                user.isRiding = false;
                user.isTaken = false;
                user.save();
                return {
                  ok: true,
                  error: null,
                  rideId: args.rideId
                };
              } else {
                const ride = await getRepository(Ride).findOne(
                  {
                    passengerId: user.id,
                    status: "ACCEPTED"
                  },
                  { relations: ["passenger"] }
                );
                if (ride) {
                  ride.remove();
                  user.isRiding = false;
                  user.isTaken = false;
                  user.save();
                  return {
                    ok: true,
                    error: null,
                    rideId: args.rideId
                  };
                } else {
                  return {
                    ok: false,
                    error: "Cant cancel ride",
                    rideId: args.rideId
                  };
                }
              }
            } else {
              return {
                ok: false,
                error: "Cant cancel ride",
                rideId: args.rideId
              };
            }
          } catch (error) {
            return {
              ok: false,
              error: error.message,
              rideId: args.rideId
            };
          }
        } else {
          return {
            ok: false,
            error: "You are not driving",
            rideId: args.rideId
          };
        }
      }
    )
  }
};
export default resolvers;
