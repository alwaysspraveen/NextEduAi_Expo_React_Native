import { AppLogo } from "@/assets/icons/icon";
import TopHeader from "@/components/TopHeader";
import { Linking, ScrollView, Text, View } from "react-native";

export default function AboutUs() {
  return (
    <View className="flex-1 bg-surface dark:bg-surface-dark">
      <TopHeader title="About Us" />
      <ScrollView
        className="flex-1 px-6"
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo + Title */}
        <View className="items-center">
          <AppLogo size={144} />

          <Text className="mt-2 text-text dark:text-text-dark text-center">
            Empowering education with AI-driven solutions
          </Text>
        </View>

        {/* Description */}
        <View className="mt-8">
          <Text className="text-lg font-semibold text-text dark:text-text-dark mb-2">
            Who We Are
          </Text>
          <Text className="text-base leading-6 tex-text dark:text-text-dark">
            NextEduAI is a modern School ERP and LMS platform that helps
            institutions simplify academics, streamline communication, and
            improve student outcomes. With AI automation, we save teachers and
            administrators valuable time, while enhancing student learning
            experiences.
          </Text>
        </View>

        {/* Mission */}
        <View className="mt-6">
          <Text className="text-lg font-semibold text-text dark:text-text-dark mb-2">
            Our Mission
          </Text>
          <Text className="text-base leading-6 text-text dark:text-text-dark">
            To transform education management with technology that is simple,
            intelligent, and impactful.
          </Text>
        </View>

        {/* Vision */}
        <View className="mt-6">
          <Text className="text-lg font-semibold text-text dark:text-text-dark mb-2">
            Our Vision
          </Text>
          <Text className="text-base leading-6 text-text dark:text-text-dark">
            A future where schools operate efficiently and students thrive with
            personalized, AI-powered learning support.
          </Text>
        </View>

        {/* Contact */}
        <View className="mt-8 border-t border-gray-200 dark:border-gray-200 pt-6">
          <Text className="text-lg font-semibold text-text dark:text-text-dark mb-3">
            Contact Us
          </Text>
          <Text
            className="text-base text-primary mb-2"
            onPress={() => Linking.openURL("mailto:info@nexteduai.com")}
          >
            info@nexteduai.com
          </Text>
          <Text
            className="text-base text-primary mb-2"
            onPress={() => Linking.openURL("tel:+911234567890")}
          >
            +91 8971319555
          </Text>
          <Text
            className="text-base text-primary"
            onPress={() => Linking.openURL("https://nexteduai.com")}
          >
            www.nexteduai.com
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
