import api from "@/backend/api";
import auth from "@/backend/auth";
import rag from "@/backend/rag";
import TopHeader from "@/components/TopHeader";
import { Picker } from "@react-native-picker/picker";
import * as DocumentPicker from "expo-document-picker";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";

export default function UploadMaterial() {
  const [classes, setClasses] = useState<{ label: string; value: string }[]>(
    []
  );
  const [subjects, setSubjects] = useState<{ label: string; value: string }[]>(
    []
  );
  const [loading] = useState(false);
  const [activeTab, setActiveTab] = useState<"announce" | "view">("announce");
  const [selectedClass, setSelectedClass] = useState<string | undefined>();
  const [selectedSubject, setSelectedSubject] = useState<string | undefined>();
  const [title, setTitle] = useState("");
  const [description] = useState("");
  const [file, setFile] = useState<any>(null);
  const [uploading, setUploading] = useState(false);

  const scheme = useColorScheme();  
  const isDark = scheme === "dark";

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      const teacherId = await auth.getUserId();
      if (!teacherId) return;

      const res = await api.getSubjectsByTeacher(teacherId);
      setClasses(
        res.map((c: any) => ({
          label: `${c.classroom.name}${c.section ? "-" + c.section : ""}`,
          value: c.classroom._id,
        }))
      );
    } catch (err) {
      console.error("❌ Failed to load classes", err);
    }
  };

  const handleClassChange = async (classId: string) => {
    setSelectedClass(classId);
    setSelectedSubject(undefined);

    try {
      const teacherId = await auth.getUserId();
      if (!teacherId) return;

      const res = await api.getSubjectsByClassandTeacher(classId, teacherId);
      setSubjects(
        res.map((s: any) => ({
          label: s.name,
          value: s._id,
        }))
      );
    } catch (err) {
      console.error("❌ Failed to load subjects", err);
    }
  };

  const pickerMimeTypes = useMemo(
    () => [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    []
  );

  const pickFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: pickerMimeTypes,
    });
    if (!result.canceled) {
      setFile(result.assets[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedClass || !selectedSubject || !file || !title.trim()) {
      Alert.alert(
        "Missing Data",
        "Please fill in all fields before uploading."
      );
      return;
    }

    try {
      setUploading(true);
      const teacherId = await auth.getUserId();
      if (!teacherId) throw new Error("No teacher ID found");

      const form = new FormData();
      form.append("classId", selectedClass);
      form.append("subjectId", selectedSubject);
      form.append("teacherId", teacherId);
      form.append("materialId", title.trim());
      form.append("file", {
        uri: file.uri,
        type:
          file.mimeType ||
          (file.name?.endsWith(".docx")
            ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            : "application/pdf"),
        name: file.name || "upload",
      } as any);

      const res = await rag.uploadMaterial(form);
      console.log("✅ Upload Response:", res);
      Alert.alert("Success", "Material uploaded successfully!");
      resetForm();
    } catch (err: any) {
      console.error("❌ Upload failed", err);
      Alert.alert("Error", err?.message || "Failed to upload");
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setSelectedClass(undefined);
    setSelectedSubject(undefined);
    setFile(null);
  };

  const placeholder = isDark ? "#94A3B8" : "#64748B"; // slate-400 / slate-500-ish
  const borderColor = isDark ? "#334155" : "#E5E7EB"; // slate-700 / gray-200

  return (
    <>
      <TopHeader
        title="Content"
        onBack={() => router.canGoBack() && router.back()}
      />

      {/* Tabs header */}
      <View className="flex-row bg-background dark:bg-background-dark border-b border-gray-200 dark:border-surface-dark">
        {(["announce", "view"] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            disabled={loading}
            className={`flex-1 py-5 items-center ${
              activeTab === tab ? "border-b-2 border-primary" : ""
            }`}
          >
            <Text
              className={`font-semibold ${
                activeTab === tab
                  ? "text-text dark:text-text-dark"
                  : "text-gray-500"
              }`}
            >
              {tab === "announce" ? "New Announcement" : "View Announcemens"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* APPLY */}
      {activeTab === "announce" && (
        <View className="flex-1 bg-surface dark:bg-surface-dark">
          <View className="m-4 rounded-xl p-4 bg-background dark:bg-background-dark shadow-sm">
            {/* Title */}
            <Text className="text-base font-semibold mb-2 text-text dark:text-text-dark ">
              Select Class
            </Text>
            <View
              className="rounded-lg mb-4 bg-surface dark:bg-surface-dark"
              style={{ borderWidth: 1, borderColor }}
            >
              <Picker
                selectedValue={selectedClass}
                onValueChange={(val) => handleClassChange(val)}
              >
                <Picker.Item label="Select Class" value={undefined} />
                {classes.map((c) => (
                  <Picker.Item key={c.value} label={c.label} value={c.value} />
                ))}
              </Picker>
            </View>
            <Text className="text-base font-semibold mb-2 text-text dark:text-text-dark">
              Title
            </Text>

            <TextInput
              className="rounded-lg px-4 py-4 mb-4 bg-surface dark:bg-surface-dark dark:text-text-dark text-text"
              style={{ borderWidth: 1, borderColor }}
              placeholderTextColor={placeholder}
              value={title}
              onChangeText={setTitle}
            />
            <Text className="text-base font-semibold mb-2 text-text dark:text-text-dark">
              Description
            </Text>

            <TextInput
              className="rounded-lg px-4 py-4 mb-4 bg-surface dark:bg-surface-dark dark:text-text-dark text-text"
              style={{ borderWidth: 1, borderColor }}
              placeholderTextColor={placeholder}
              value={description}
              onChangeText={setTitle}
            />

            {/* Upload Button */}
            <TouchableOpacity
              onPress={handleUpload}
              disabled={uploading}
              className="py-3 rounded-lg items-center bg-primary"
              style={{ opacity: uploading ? 0.7 : 1 }}
            >
              {uploading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-semibold">Publish</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* VIEW (placeholder kept commented) */}
    </>
  );
}
