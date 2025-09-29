import AppError from "../../errorHelpers/AppError";

export const parseProjectPayload = (payload: any) => {
    // Convert authorId
    const authorId = Number(payload.authorId);
    if (isNaN(authorId)) {
        throw new AppError(400, "authorId must be a valid number");
    }

    // Convert techStack
    let techStack: string[] = [];
    if (payload.techStack) {
        techStack = Array.isArray(payload.techStack)
            ? payload.techStack
            : payload.techStack.split(",").map((t: string) => t.trim());
    }

    // Convert featured
    let featured = false;
    if (payload.featured) {
        if (typeof payload.featured === "string") {
            featured =
                payload.featured.toLowerCase() === "true" ||
                payload.featured === "1" ||
                payload.featured.toLowerCase() === "on";
        } else {
            featured = Boolean(payload.featured);
        }
    }

    // Spread first, then overwrite with parsed values ✅
    return {
        ...payload,
        authorId,
        techStack,
        featured,
    };
};
