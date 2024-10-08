# Todo Application
## Technologies Used
### Backend
Java, SpringBoot, JPA, OracleDB (configuration can be found in `./TodoBackend/src/main/resources/application.properties`)

### Frontend
Ojet, Typescript, Javascript

## Frontend Features
### Homepage
You can delete multiple tasks at a time using the Delete Tasks button.
![Todo Homepage](./images/todo_homepage.png)
### Add Task
![Add Task](./images/todo_addtask.png)
### Edit Task
![Edit Task](./images/todo_edittask.png)
### Add Custom Tags
Tags has following features
- Can add new custom tags (colors are initialized randomly).
- Existing tags appear as suggestion in `oj-combobox-many`.
- Tags have consistent colors.

![Custom Tags](./images/todo_tags.png)
### Search
You can use two types of search
- Normal Search - Search based on id, title or description.
- Tag Search - Search based on tag (calls api with custom query).

![Search](./images/todo_search.png)