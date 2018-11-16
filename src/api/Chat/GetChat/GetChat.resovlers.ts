import { Resolvers } from "src/types/resolvers";
import privateResolver from "src/utils/privateResolver";
import { GetChatResponse, GetChatQueryArgs } from '../../../types/graph';
import User from 'src/entities/User';
import Chat from 'src/entities/Chat';

const resolvers: Resolvers = {
    Query: {
        GetChat: privateResolver(
            async(
                _,
                args: GetChatQueryArgs,
                { req }
            ): Promise<GetChatResponse> => {
                const user: User = req.user
                try {
                    const chat = await Chat.findOne({
                        id: args.chatId
                    })
                    if (chat) {
                        if (chat.passengerId === user.id || chat.driverId === user.id) {
                            return {
                                ok: true,
                                error: null,
                                chat
                            }
                        } else {
                            return {
                                ok: false,
                                error: "No Authorized to see this chat",
                                chat: null
                            }
                        }
                    } else {
                        return {
                            ok: false,
                            error: "Chat not found",
                            chat: null
                        }
                    }
                } catch (error) {
                    return {
                        ok: false,
                        error: error.message,
                        chat: null
                    }
                }
            }
        )
    }
}

export default resolvers;