import { deleteFeedFollow } from "src/lib/db/queries/feedFollows";
import { getFeedByUrl } from "src/lib/db/queries/feeds";
import { User } from "src/lib/db/schema";

export async function handlerUnfollow(
    cmdName: string, 
    user: User, 
    ...args: string[]
) {

    const feedId = (await getFeedByUrl(args[0])).id;

    if(!feedId) {
        throw new Error("The requested feed was not found");
    }
    await deleteFeedFollow(feedId, user.id);
}