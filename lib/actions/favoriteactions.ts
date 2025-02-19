'use server';

import { createClient } from '@/utils/supabase/server';

export const toggleFavorite = async (image: { id: string; webformatURL: string }) => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    // Check if the image is already favorited
    const { data: existingFavorite, error: fetchError } = await supabase
        .from("favorites")
        .select("id")
        .eq("user_id", user.id)
        .eq("image_id", image.id)
        .single();

    if (fetchError && fetchError.code !== "PGRST116") {
        console.error("Error checking favorite:", fetchError);
        return;
    }

    if (existingFavorite) {
        // Remove from favorites
        const { error: deleteError } = await supabase
            .from("favorites")
            .delete()
            .match({ user_id: user.id, image_id: image.id });

        if (deleteError) console.error("Error removing favorite:", deleteError);
    } else {
        // Add to favorites
        const { error: insertError } = await supabase
            .from("favorites")
            .insert([{ user_id: user.id, image_id: image.id, image_url: image.webformatURL }]);

        if (insertError) console.error("Error adding favorite:", insertError);
    }
};


export const getFavorites = async (userId: string) => {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("favorites")
        .select("image_id, image_url")
        .eq("user_id", userId);

    if (error) {
        console.error("Error fetching favorites:", error);
        return [];
    }

    return data;
};

export const removeFavorite = async (imageId: string, userId: string) => {
    const supabase = await createClient();
    const { error } = await supabase
        .from("favorites")
        .delete()
        .match({ user_id: userId, image_id: imageId });

    if (error) {
        console.error("Error removing favorite:", error);
    }
};
