import systemService from '../../api/system'
import tools from '../../utils/tools'

const state = {
	isBtn: 1,   //   1.屏幕按键， 2.按钮按键
	keyArray: [],
	btnKeyArray: [],
	MaxPressKeys: 6,
	lastBtnMsg: { //  记录上一次按键的位置
		lastBtn: '',  //  记录上一次方向按键
		lastBtnX: '', //  记录上一次按钮X
		lastBtnY: '',  //  记录上一次按钮Y
		lastBtnCode: '' // 记录上一次的keycode
	},
	initMsg: {
		token: '',
		param: '',
		app: '',
		flag: 1
	},
	itemList: [],
	currentTutorial: false,
	moveItem: false,
	navBarShow: false,
	editKeyboard: false,
	clickEditKeyboard: false,
	copyItemList: {
		myselfKeyboardArr: [],
		myselfKeyboardIndex: null
	},
	customizeBtnLists: [],
	justSave: false,
	rememberHasSaveKeyboard: [],
	showNavBar: false,
	saveAfterEdit: {
		itemList: [],
		saveFlag: false
	},
	createClick: false,
	hideShowCourse: false,
	levelShow: false,
	addNewCustomizeBtn: false,
	rollerInfoData: {},
	mouseMode: false, // true为触屏模式，false为鼠标模式
	saveOfficialKeyboardFlag: '',
	fullScreenShow: true,
	officialKeyInfo:[],
	popupNav: '',
	beforeCustomKeyboard: {
		item: [],
		index: ''
	},
	judgeTouchStart: false
}

// 计算后返回
const getters = {
	isBtn: state => state.isBtn,
	keyArray: state => state.keyArray,
	btnKeyArray: state => state.btnKeyArray,
	MaxPressKeys: state => state.MaxPressKeys,
	lastBtnMsg: state => state.lastBtnMsg,
	initMsg: state => state.initMsg,
	itemList: state => state.itemList,
	currentTutorial: state => state.currentTutorial,
	moveItem: state => state.moveItem,
	navBarShow: state => state.navBarShow,
	editKeyboard: state => state.editKeyboard,
	clickEditKeyboard: state => state.clickEditKeyboard,
	copyItemList: state => state.copyItemList,
	customizeBtnLists: state => state.customizeBtnLists,
	justSave: state => state.justSave,
	rememberHasSaveKeyboard: state => state.rememberHasSaveKeyboard,
	showNavBar: state => state.showNavBar,
	saveAfterEdit: state => state.saveAfterEdit,
	createClick: state => state.createClick,
	hideShowCourse: state => state.hideShowCourse,
	levelShow: state => state.levelShow,
	addNewCustomizeBtn: state => state.addNewCustomizeBtn,
	rollerInfoData: state => state.rollerInfoData,
	mouseMode: state => state.mouseMode,
	saveOfficialKeyboardFlag: state => state.saveOfficialKeyboardFlag,
	fullScreenShow: state => state.fullScreenShow,
	officialKeyInfo:state=>state.officialKeyInfo,
	popupNav: state => state.popupNav,
	beforeCustomKeyboard: state => state.beforeCustomKeyboard,
	judgeTouchStart: state => state.judgeTouchStart
}

// 调用api，异步请求
const actions = {
	getCustomizeBtnLists ({ commit }, products) {
		return systemService.getMyKeyboard(products).then(data => {
			if (!!data.success && data.data.length) {
				var keyList=data.data.filter(item=> item.keyboard_type != 3)
				commit('setCustomizeBtnLists', keyList.reverse())
			}
			return data
		})
	},
	getkeyInfo ({ commit }, products) {
		return systemService.getKeyboardInfo(products).then(data => {
			if(!data.data) return
			let keyInfo = JSON.parse(data.data.key_info)
			let width=data.data.width;
			let height=data.data.height;
			let officialkey = keyInfo.map((item)=>{
			item.keyMarginTop= item.keyMarginTop =='-1' ? height-item.keyMarginBottom-item.keyHeight : item.keyMarginTop;
			item.keyMarginLeft=item.keyMarginLeft =='-1' ? width-item.keyMarginRight-item.keyWidth : item.keyMarginLeft;
			item.keyName=item.keyName.replace(/\\n/g,'\n')
          	return item
			})
			commit('setKeyInfo',officialkey)
			return officialkey
		})
	}
}


const mutations = {
	set_token (state, token) {
		sessionStorage.token = token;
		state.initMsg.token = token;
	},
	set_param (state, param) {
		console.log('set_param')
		console.log(param)
		sessionStorage.param = param;
		state.initMsg.param = param;
	},
	set_app (state, app) {
		sessionStorage.app = app;
		state.initMsg.app = app;
	},
	set_flag (state, flag) {
		sessionStorage.flag = flag;
		state.initMsg.flag = flag;
	},
	set_key (state, keyCode) {
		if (state.keyArray.length>=state.MaxPressKeys) {
			return;
		}
		if((typeof keyCode == 'object') && (state.keyArray.length >= state.MaxPressKeys - 1)) {
			return;
		}
		if (typeof keyCode == 'object') {
			for (let i=0; i<keyCode.length; i++) {
				state.keyArray.push(keyCode[i])
			}
		} else {
			state.keyArray.push(keyCode)
		}
	},
	set_EmptyKey (state) {
		state.keyArray = []
	},
	delete_key (state, keyVal) {
		for (let i=0; i<state.keyArray.length;i++) {
			if (typeof keyVal == 'object') {
				state.keyArray.splice(i, 2);
			} else {
				if (state.keyArray[i] == keyVal) {
					state.keyArray.splice(i, 1)
					break
				}
			}
		}
	},
	set_BtnKeyArray (state, keyCode) {
		if (state.btnKeyArray.length >= state.MaxPressKeys) {
			return;
		}
		if((typeof keyCode == 'object') && (state.btnKeyArray.length >= state.MaxPressKeys - 1)) {
			return;
		}
		if (typeof keyCode == 'object') {
			for (let i = 0; i < keyCode.length; i++) {
				state.btnKeyArray.push(keyCode[i])
			}
		} else {
			state.btnKeyArray.push(keyCode)
		}
	},
	set_BtnEmptyKey (state) {
		state.btnKeyArray = []
	},
	// 设置按键的类型
	set_btn (state, num) {
		state.isBtn = num;
	},
	//  记录上一次按键的信息
	set_LastBtn (state, btn) {
		state.lastBtnMsg.lastBtn = btn;
		// state.lastBtnMsg.lastBtnCode = btn.keyCode;
	},
	// 记录上一次按键的位置
	set_BtnSite (x,y) {
		state.lastBtnMsg.lastBtnX = x;
		state.lastBtnMsg.lastBtnY = y;
	},
	setItemList (state, data) {
		state.itemList = data
	},
	addItemList (state, data) {
		state.itemList = state.itemList.concat(data)
	},
	cutItemList (state, data) {
		state.itemList.splice(data, 1)
	},
	setCurrentTutorial (state, data) {
		state.currentTutorial = data
	},
	setMoveItem (state, data) {
		state.moveItem = data
	},
	setNavBarShow (state, data) {
		state.navBarShow = data
	},
	setEditKeyboard (state, data) {
		state.editKeyboard = data
	},
	setClickEditKeyboard (state, data) {
		state.clickEditKeyboard = data
	},
	setCopyItemList (state, data) {
		state.copyItemList = data
	},
	setCustomizeBtnLists (state, data) {
		state.customizeBtnLists = tools.duplicate([...data, ...state.customizeBtnLists], 'key_id')
	},
	setHasDelCustomizeBtn (state, data) {
		state.customizeBtnLists = state.customizeBtnLists.filter(item => item.key_id !== data)
	},
	setJustSave (state, data) {
		state.justSave = data
	},
	setRememberHasSaveKeyboard (state, data) {
		state.rememberHasSaveKeyboard = Object.freeze(data)
	},
	setShowNavBar (state, data) {
		state.showNavBar = data
	},
	setSaveAfterEdit (state, data) {
		state.saveAfterEdit = data
	},
	setCreateClick (state, data) {
		state.createClick = data
	},
	setHideShowCourse (state, data) {
		state.hideShowCourse = data
	},
	setLevelShow (state, data) {
		state.levelShow = data
	},
	setAddNewCustomizeBtn (state, data) {
		state.addNewCustomizeBtn = data
	},
	setRollerInfo (state, data) {
		state.rollerInfoData = data
	},
	setMouseMode (state, data) {
		state.mouseMode = data
	},
	setSaveOfficialKeyboardFlag (state, data) {
		state.saveOfficialKeyboardFlag = data
	},
	setFullScreenShow (state, data) {
		state.fullScreenShow = data
	},
	setKeyInfo(state,data){
		state.officialKeyInfo=data
	},
	setPopupNav (state, data) {
		state.popupNav = data
	},
	setBeforeCustomKeyboard (state, data) {
		state.beforeCustomKeyboard = data
	},
	setJudgeTouchStart (state, data) {
		state.judgeTouchStart = data
	}
}

export default {
	state: state,
	getters: getters,
	actions: actions,
	mutations: mutations
}