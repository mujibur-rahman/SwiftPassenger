// @/components/rental/CarCard.jsx
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'

// Inline fallback colour shown while the remote image loads / if it errors.
const FALLBACK_BG = '#e5e7eb';

const CarCard = ({ car, onPress, primary }) => {
    // Guard: only pass a valid http(s) URI to <Image uri>. Local @assets paths
    // (which the server used to send) are not valid network URIs and will cause
    // a blank render without throwing, so we strip them here as a safety net.
    const imageUri =
        car.image && car.image.startsWith('http') ? car.image : null;

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={onPress}
            className="mb-4 flex-row overflow-hidden rounded-2xl border border-border bg-card"
        >
            <Image
                source={imageUri ? { uri: imageUri } : null}
                style={styles.carImage}
                resizeMode="cover"
            />
            <View className="flex-1 justify-between p-3">
                <View>
                    <Text className="text-base font-inter-bold text-foreground" numberOfLines={1}>
                        {car.name}
                    </Text>
                    <Text className="mt-1 text-xs text-foreground-muted">
                        ★ {car.rating}  ·  {car.seats} seats  ·  {car.transmission}
                    </Text>
                    <Text className="mt-0.5 text-xs text-foreground-muted">
                        {car.fuel}  ·  {car.category}
                    </Text>
                </View>
                <View className="mt-2 flex-row items-center justify-between">
                    <Text className="text-base font-inter-bold" style={{ color: primary }}>
                        $ {car.pricePerDay.toLocaleString()}
                        <Text className="text-xs font-inter-regular text-foreground-muted">
                            {" "}/day
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
    )
}

const styles = StyleSheet.create({
    carImage: {
        width: 120,
        height: 110,
        backgroundColor: FALLBACK_BG,
    },
});

export default CarCard