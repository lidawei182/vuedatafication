import {
	loginByUsername,
	getUserInfo
} from '@/api/login'
import {
	getToken,
	setToken,
	removeToken
} from '@/utils/auth'

const user = {
	state: {
		token: getToken(),
		id: 0,
		name: '',
		avatar: '',
		status: '',
		realName: '',
		phone: '',
		email: '',
		roles: 0,
		group: '',
		code: '',
		jdno:0,
	},

	mutations: {
		SET_TOKEN: (state, token) => {
			state.token = token
		},
		SET_ID: (state, id) => {
			state.id = id
		},
		SET_REALNAME: (state, realName) => {
			state.realName = realName
		},
		SET_EMAIL: (state, email) => {
			state.email = email
		},
		SET_PHONE: (state, phone) => {
			state.phone = phone
		},
		SET_STATUS: (state, status) => {
			state.status = status
		},
		SET_NAME: (state, name) => {
			state.name = name
		},
		SET_AVATAR: (state, avatar) => {
			state.avatar = avatar
		},
		SET_ROLES: (state, roles) => {
			state.roles = roles
		},
		SET_GROUP: (state, group) => {
			state.group = group
		},
		SET_CODE: (state, code) => {
			state.code = code
		},
		SET_JDNO: (state, jdno) => {
			state.jdno = jdno
		},
	},

	actions: {
		// 用户名登录
		LoginByUsername({
			commit
		}, userInfo) {
			const username = userInfo.username.trim()
			return new Promise((resolve, reject) => {
				loginByUsername(username, userInfo.password).then(response => {
					const data = response.data
					commit('SET_TOKEN', data.userToken)
					setToken(response.data.userToken)
					resolve()
				}).catch(error => {
					reject(error)
				})
			})
		},
		// 获取用户信息
		GetUserInfo({
			commit,
			// state 状态備用 
		}) {
			return new Promise((resolve, reject) => {
				getUserInfo().then(response => {
					if (!response.data) { // 由于mockjs 不支持自定义状态码只能这样hack
						reject('error')
					}
					const data = response.data
					
					if (data.access) {
						commit('SET_ROLES', 2)
					} else {
						reject('拉取用户权限失败')
					}
					console.log(data);
					commit('SET_ID', data.id)
					commit('SET_NAME', data.userName)
					commit('SET_AVATAR', data.img)
					commit('SET_REALNAME', data.realName)
					commit('SET_PHONE', data.phone)
					commit('SET_EMAIL', data.email)
					commit('SET_GROUP', data.group)
					commit('SET_CODE', data.UnitNo)
					commit('SET_JDNO', data.jdno)
					resolve(response)
				}).catch(error => {
					reject(error)
				})
			})
		},

		// 前端 登出
		FedLogOut({
			commit
		}) {
			return new Promise(resolve => {
				commit('SET_TOKEN', '')
				commit('SET_ROLES', 0)
				removeToken()
				resolve()
			})
		},

		// 动态修改权限
		ChangeRoles({
			commit,
			dispatch
		}) {
			return new Promise(resolve => {
				getUserInfo().then(response => {
					const data = response.data
					commit('SET_ROLES', data.roles)
					commit('SET_NAME', data.name)
					commit('SET_AVATAR', data.avatar)
					commit('SET_INTRODUCTION', data.introduction)
					dispatch('GenerateRoutes', data) // 动态修改权限后 重绘侧边菜单
					resolve()
				})
			})
		}
	}
}

export default user
