import { Pressable, StyleSheet, Text, TextInput, View, ScrollView, Alert, SectionList } from "react-native";
import { scale } from "react-native-size-matters";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from '@expo/vector-icons';

import React, { useEffect, useRef, useState } from 'react'

type Task = {
    id: string,
    text: string,
    createdAt: number,
}

type TaskSection = {
    title: string,
    data: Task[],
}

const Home = () => {
    const [taskInput, setTaskInput] = useState("");
    const [tasks, setTasks] = useState<Task[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const inputRef = useRef<TextInput>(null);

    const handleAddOrUpdate = () => {
        if (!taskInput.trim()) return;

        if (editingId !== null) {
            setTasks(
                prevTasks => prevTasks.map((task) => (
                    task.id === editingId ? { text: taskInput, id: task.id, createdAt: task.createdAt } : task
                ))
            )
            setEditingId(null);
        } else {
            setTasks(prevTasks => [...prevTasks, { text: taskInput, id: Date.now().toString(), createdAt: Date.now() }])
        }

        setTaskInput("");
    }

    const saveTasks = async (tasks: Task[]) => {
        try {
            await AsyncStorage.setItem("tasks", JSON.stringify(tasks))
        } catch (error) {
            console.log("Error saving todos", error)
        }
    }

    const loadTasks = async () => {
        try {
            const storedTasks = await AsyncStorage.getItem("tasks")
            if (storedTasks) {
                return JSON.parse(storedTasks);
            }
            return [];
        } catch (error) {
            console.log("Error loading todos", error);
        }
    }

    useEffect(() => {
        loadTasks().then(setTasks);
    }, [])

    useEffect(() => {
        saveTasks(tasks);
    }, [tasks])

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
                        setTasks(
                            tasks.filter((task) => (
                                task.id !== taskId
                            ))
                        )
                        setTaskInput("");
                        setEditingId(null);
                    }
                }
            ],
            { cancelable: true }
        )
    }

    function onEdit(taskToEdit: string, id: string) {
        setTaskInput(taskToEdit);
        setEditingId(id);
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

    const groupedTasks = groupTasksByDates(tasks);

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
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
                        <Text style={styles.taskText}>{item.text}</Text>
                        <View style={styles.buttonContainer}>
                            <Pressable style={styles.deleteButton} onPress={() => onDelete(item.id)}>
                                <Ionicons name="trash-outline" size={16} color="red" />
                            </Pressable>
                            <Pressable style={styles.editButton} onPress={() => onEdit(item.text, item.id)}>
                                <Ionicons name="create-outline" size={16} color="white" />
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
        marginTop: scale(15),
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
        maxWidth: scale(250)
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
})

export default Home;