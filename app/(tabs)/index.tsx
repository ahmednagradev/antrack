import { Pressable, StyleSheet, Text, TextInput, View, Alert, SectionList } from "react-native";
import { scale } from "react-native-size-matters";
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store";
import { addTask, updateTask, deleteTask, archiveTask, Task } from "@/store/tasksSlice";

import React, { useEffect, useRef, useState } from 'react';

type TaskSection = {
    title: string,
    data: Task[],
}

const Home = () => {
    const dispatch = useDispatch<AppDispatch>();
    const tasks = useSelector((state: RootState) => state.tasks.tasks);
    const activeTasks = tasks.filter(task => task.status === "active");

    const [taskInput, setTaskInput] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const inputRef = useRef<TextInput>(null);

    const handleAddOrUpdate = () => {
        if (!taskInput.trim()) return;
        if (editingId) {
            dispatch(updateTask({ id: editingId, text: taskInput }))
            setEditingId(null);
        } else {
            dispatch(addTask({ id: Date.now().toString(), text: taskInput, createdAt: Date.now() }));
        }
        setTaskInput("");
        inputRef.current?.blur();
    }


    function onDelete(taskId: string) {
        Alert.alert(
            "Delete Task",
            "Are you sure you want to delete this task?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    onPress: () => {
                        dispatch(deleteTask({ id: taskId }))
                        setTaskInput("");
                        setEditingId(null);
                        inputRef.current?.blur();
                    }
                }
            ],
            { cancelable: true }
        )
    }

    function onArchive(taskId: string) {
        dispatch(archiveTask({ id: taskId }))
        setTaskInput("");
        setEditingId(null);
        inputRef.current?.blur();
    }

    function onEdit(taskToEdit: string, taskId: string) {
        setTaskInput(taskToEdit);
        setEditingId(taskId);
    }

    useEffect(() => {
        if (editingId !== null) {
            inputRef.current?.focus();
        }
    }, [editingId]);

    function groupTasksByDates(tasks: Task[]): TaskSection[] {
        const today = new Date();
        today.setHours(0, 0, 0, 0)

        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1)

        const groups: Record<string, Task[]> = {};

        const sortedTasks = [...tasks].sort(
            (a, b) => b.createdAt - a.createdAt
        )

        for (const task of sortedTasks) {
            const taskDate = new Date(task.createdAt)
            taskDate.setHours(0, 0, 0, 0);

            let groupTitle = "";

            if (taskDate.getTime() === today.getTime()) {
                groupTitle = "Today";
            } else if (taskDate.getTime() === yesterday.getTime()) {
                groupTitle = "Yesterday";
            } else {
                groupTitle = taskDate.toDateString();
            }

            if (!groups[groupTitle]) {
                groups[groupTitle] = [];
            }

            groups[groupTitle].push(task);
        }
        return Object.entries(groups).map(([title, data]) => (
            {
                title,
                data,
            }
        ))
    }

    const groupedTasks = groupTasksByDates(activeTasks);

    function formatTime(timestamp: number) {
        const date = new Date(timestamp);

        return date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    }


    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    returnKeyType="done"
                    onSubmitEditing={handleAddOrUpdate}
                    style={styles.input}
                    placeholder="Add new task"
                    value={taskInput}
                    onChangeText={(text) => setTaskInput(text)}
                    ref={inputRef}
                />

                <Pressable style={styles.button} onPress={handleAddOrUpdate}>
                    <Text style={styles.buttonText}>
                        {editingId !== null ? "Update" : "Add"}
                    </Text>
                </Pressable>
            </View>

            <SectionList
                keyboardShouldPersistTaps={"handled"}
                contentContainerStyle={{ alignItems: "center", gap: scale(4) }}
                style={styles.taskList}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                sections={groupedTasks}
                renderSectionHeader={({ section }) => (
                    <Text style={styles.groupName}>{section.title}</Text>
                )}
                renderItem={({ item }) => (
                    <View style={styles.listItem}>
                        <View>
                            <Text style={styles.taskText}>{item.text}</Text>
                            <Text style={styles.time}>
                                {formatTime(item.createdAt)}
                            </Text>
                        </View>
                        <View style={styles.buttonContainer}>
                            <Pressable style={styles.deleteButton} onPress={() => onDelete(item.id)}>
                                <Ionicons name="trash-outline" size={16} color="red" />
                            </Pressable>
                            <Pressable style={styles.editButton} onPress={() => onEdit(item.text, item.id)}>
                                <Ionicons name="create-outline" size={16} color="white" />
                            </Pressable>
                            <Pressable style={styles.archiveButton} onPress={() => onArchive(item.id)}>
                                <Ionicons name="archive-outline" size={16} color="lightblue" />
                            </Pressable>
                        </View>
                    </View>
                )}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: scale(30),
        flex: scale(1),
        paddingHorizontal: scale(13),
        paddingVertical: scale(13),
    },
    inputContainer: {
        flexDirection: "row",
        justifyContent: "center"
    },
    input: {
        backgroundColor: "white",
        paddingVertical: scale(10),
        paddingHorizontal: scale(12),
        borderTopLeftRadius: scale(4),
        borderBottomLeftRadius: scale(4),
        width: scale(270),
        outlineWidth: 0,
    },
    button: {
        paddingHorizontal: scale(10),
        paddingVertical: scale(10),
        minWidth: scale(60),
        backgroundColor: "blue",
        borderTopRightRadius: scale(4),
        borderBottomRightRadius: scale(4),
        alignItems: "center",
        outlineWidth: 0,
    },
    buttonText: {
        color: "white",
        fontWeight: "500"
    },
    taskList: {
        marginTop: scale(14),
        flex: scale(1),
    },
    groupName: {
        color: "white",
        fontSize: scale(10),
        marginBottom: scale(2)
    },
    listItem: {
        backgroundColor: "#444",
        borderRadius: scale(4),
        paddingVertical: scale(7),
        paddingHorizontal: scale(8),
        width: scale(320),
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    taskText: {
        color: "white",
        maxWidth: scale(250),
        fontSize: scale(12)
    },
    time: {
        color: "white",
        marginTop: scale(4),
        fontSize: scale(8)
    },
    buttonContainer: {
        flexDirection: "row",
        gap: scale(4),
    },
    deleteButton: {
        backgroundColor: "lightblue",
        borderRadius: scale(4),
        padding: scale(4),
        outlineWidth: 0,
    },
    editButton: {
        backgroundColor: "blue",
        borderRadius: scale(4),
        padding: scale(4),
        outlineWidth: 0,
    },
    archiveButton: {
        backgroundColor: "darkblue",
        borderRadius: scale(4),
        padding: scale(4),
        outlineWidth: 0,
    },
})

export default Home;