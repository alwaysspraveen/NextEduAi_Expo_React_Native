import api from "@/backend/api";
import auth from "@/backend/auth";
import rag from "@/backend/rag";
import ContentCard from "@/components/ContentCard";
import TopHeader from "@/components/TopHeader";
import { Picker } from "@react-native-picker/picker";
import * as DocumentPicker from "expo-document-picker";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Alert, View, useColorScheme } from "react-native";

export default function UploadMaterial() {
  const [classes, setClasses] = useState<{ label: string; value: string }[]>(
    []
  );
  const [subjects, setSubjects] = useState<{ label: string; value: string }[]>(
    []
  );
  const [selectedClass, setSelectedClass] = useState<string | undefined>();
  const [selectedSubject, setSelectedSubject] = useState<string | undefined>();
  const [title, setTitle] = useState("");
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

      <View className="flex-1 bg-surface dark:bg-surface-dark">
        <View className="m-4 rounded-xl p-4 bg-background dark:bg-background-dark shadow-sm">
          <View
            className="rounded-xl mb-4 bg-background dark:bg-background-dark"
            style={{ borderWidth: 1, borderColor }}
          >
            <Picker
              selectedValue={selectedSubject}
              onValueChange={(val) => setSelectedSubject(val)}
            >
              <Picker.Item label="Select Subject" value={undefined} />
              {subjects.map((s) => (
                <Picker.Item key={s.value} label={s.label} value={s.value} />
              ))}
            </Picker>
          </View>
          <ContentCard
            fileName="01_Maths_Notes.pdf"
            title={"English"}
            teacherName={"Zoya Reddy"}
            dateTime={"12:15 AM - 10 Sep 2025"}
          />
          <ContentCard
            fileName="01_Maths_Notes.pdf"
            title={"English"}
            teacherName={"Navya"}
            dateTime={"12:15 AM - 10 Sep 2025"}
          />
        </View>
      </View>
    </>
  );
}
