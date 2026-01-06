import React from "react";
import { View, Text, SectionList, Pressable, StyleSheet, Alert } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/store";
import { deleteTask, unarchiveTask } from "@/store/tasksSlice";
import { Ionicons } from "@expo/vector-icons";
import { scale } from "react-native-size-matters";


const History = () => {
	const dispatch = useDispatch<AppDispatch>();

	const tasks = useSelector((state: RootState) => state.tasks.tasks);
	const archivedTasks = tasks.filter(task => task.status === "archived");

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
					}
				}
			],
			{ cancelable: true }
		)
	}

	function groupArchivedTasks(tasks: typeof archivedTasks) {
		const today = new Date();
		today.setHours(0, 0, 0, 0)

		const yesterday = new Date();
		yesterday.setDate(today.getDate() - 1)

		const groups: Record<string, typeof archivedTasks> = {};

		const sortedTasks = [...tasks].sort(
			(a, b) => (b.archivedAt ?? 0) - (a.archivedAt ?? 0)
		)

		for (const task of sortedTasks) {
			if (!task.archivedAt) continue;

			const taskDate = new Date(task.archivedAt);
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

		return Object.entries(groups).map(([title, data]) => ({
			title,
			data,
		}));
	}

	const groupedTasks = groupArchivedTasks(archivedTasks);

	function formatTime(timestamp: number) {
		const date = new Date(timestamp);

		return date.toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit",
		});
	}

	return (
		<View style={styles.container}>
			<Text style={styles.heading}>Completed Tasks</Text>
			<SectionList
				keyboardShouldPersistTaps={"handled"}
				contentContainerStyle={{ alignItems: "center", gap: scale(4) }}
				style={styles.taskList}
				sections={groupedTasks}
				keyExtractor={(item) => item.id}
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
							<Pressable
								style={styles.undoButton}
								onPress={() => dispatch(unarchiveTask({ id: item.id }))}
							>
								<Ionicons name="arrow-undo-outline" size={16} color="white" />
							</Pressable>
						</View>
					</View>
				)}
			/>
		</View>
	);

}

const styles = StyleSheet.create({
	container: {
		marginTop: scale(30),
		flex: scale(1),
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: scale(13),
		paddingVertical: scale(13),
	},
	heading: {
		color: "white",
		fontSize: scale(16),
		fontWeight: 600,
	},
	groupName: {
		color: "white",
		fontSize: scale(10),
		marginBottom: scale(2),
		textAlign: "center"
	},
	taskList: {
		marginTop: scale(12),
		flex: scale(1),
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
        fontSize: scale(12),
		textDecorationLine: "line-through",
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
	undoButton: {
		backgroundColor: "blue",
		borderRadius: scale(4),
		padding: scale(4),
		outlineWidth: 0,
	},
	deleteButton: {
		backgroundColor: "lightblue",
		borderRadius: scale(4),
		padding: scale(4),
		outlineWidth: 0,
	},
});


export default History;