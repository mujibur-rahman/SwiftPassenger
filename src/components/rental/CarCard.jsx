// @/components/rental/CarCard.jsx
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";

const FALLBACK_BG = "#e5e7eb";

/**
 * Resolves Image source for:
 * - require() result (number)
 * - { uri: "https://..." }
 * - plain "https://..." string
 */
export function resolveCarImageSource(image) {
    if (image == null) return null;
    if (typeof image === "number") return image; // require()
    if (typeof image === "object" && image.uri) return image;
    if (typeof image === "string" && image.startsWith("http")) {
        return { uri: image };
    }
    return null;
}

const CarCard = ({ car, onPress, primary, currency = "A$" }) => {
    const source = resolveCarImageSource(car?.image);

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={onPress}
            className="mb-4 flex-row overflow-hidden rounded-2xl border border-border bg-card"
        >
            <Image
                source={source}
                style={styles.carImage}
                resizeMode="cover"
            />
            <View className="flex-1 justify-between p-3">
                <View>
                    <Text
                        className="text-base font-inter-bold text-foreground"
                        numberOfLines={1}
                    >
                        {car.name}
                    </Text>
                    <Text className="mt-1 text-xs text-foreground-muted">
                        ★ {car.rating} · {car.seats} seats · {car.transmission}
                    </Text>
                    <Text className="mt-0.5 text-xs text-foreground-muted">
                        {car.fuel} · {car.category}
                    </Text>
                </View>
                <View className="mt-2 flex-row items-center justify-between">
                    <Text
                        className="text-base font-inter-bold"
                        style={{ color: primary }}
                    >
                        {currency} {Number(car.pricePerDay || 0).toLocaleString()}
                        <Text className="text-xs font-inter-regular text-foreground-muted">
                            {" "}
                            /day
                        </Text>
                    </Text>
                    <View
                        className="rounded-lg px-3 py-1.5"
                        style={{ backgroundColor: primary }}
                    >
                        <Text className="text-xs font-inter-semibold text-primary-foreground">
                            Book
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    carImage: {
        width: 120,
        height: 110,
        backgroundColor: FALLBACK_BG,
    },
});

export default CarCard;
