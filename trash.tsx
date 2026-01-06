    // const [tasks, setTasks] = useState<Task[]>([]);

    // const handleAddOrUpdate = () => {
    //     if (!taskInput.trim()) return;

    //     if (editingId !== null) {
    //         setTasks(
    //             prevTasks => prevTasks.map((task) => (
    //                 task.id === editingId ? { text: taskInput, id: task.id, createdAt: task.createdAt } : task
    //             ))
    //         )
    //         setEditingId(null);
    //     } else {
    //         setTasks(prevTasks => [...prevTasks, { text: taskInput, id: Date.now().toString(), createdAt: Date.now() }])
    //     }

    //     setTaskInput("");
    // }

    // const saveTasks = async (tasks: Task[]) => {
    //     try {
    //         await AsyncStorage.setItem("tasks", JSON.stringify(tasks))
    //     } catch (error) {
    //         console.log("Error saving todos", error)
    //     }
    // }

    // const loadTasks = async () => {
    //     try {
    //         const storedTasks = await AsyncStorage.getItem("tasks")
    //         if (storedTasks) {
    //             return JSON.parse(storedTasks);
    //         }
    //         return [];
    //     } catch (error) {
    //         console.log("Error loading todos", error);
    //     }
    // }

    // useEffect(() => {
    //     loadTasks().then(setTasks);
    // }, [])

    // useEffect(() => {
    //     saveTasks(tasks);
    // }, [tasks])


    
    // type Task = {
    //     id: string,
    //     text: string,
    //     createdAt: number,
    // }

     
    // onPress: () => {
    //     setTasks(
    //         tasks.filter((task) => (
    //             task.id !== taskId
    //         ))
    //     )
    // }

    
        // addTask: (state, action: PayloadAction<Task>) => {
        //     state.tasks.push(action.payload);
        // },

        
        // updateTask: (state, action: PayloadAction<Task>) => {
        //     const task = state.tasks.find(task => task.id === action.payload.id)
        //     if (task) {
        //         task.text = action.payload.text;
        //     }
        // },

        
        // deleteTask: (state, action: PayloadAction<Task>) => {
        //     state.tasks = state.tasks.filter(task => task.id !== action.payload.id);
        // },