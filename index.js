/**
 * @namespace: Saram Core (http://saram.elab.kr)
 * @author: Lee Sanghyuck (http://profile.elab.kr)
 * @version: 0.1
 * @since: 2013.04.20
 * @description: Saram의 중심체 입니다.
 *
 * 용어 설명, 기본 API
 *
 * context : 요청과 응답 사이 프로세싱 과정에 가공되는 데이터 집합
 * module content : 모듈 그 자체
 * module object : 모듈 오브젝트 (mid를 갖는다)
 * pipeline : 요청이 왔을때 응답할 파이프의 묶음
 * pipe : 개개의 처리 과정
 * weld : 상위 모듈의 파이프에서 하위 모듈의 파이프로 연결
 * bundle : 각종 pipe와 weld를 가지고 있는 객체
 * perm : read, write 권한 (최 상위 권한, 내부 권한이 존재할 수 있음)
 * event : 모듈에서 발생한 이벤트
 *
 * bundle 구조
 * welds : 다른 모듈들하고 연결됨 최우선 탐색
 * get : get method pipe
 * post : post method pipe
 *
 * event 기초
 * 기본적으로 saram-core에서 모든 모듈 액션에 관하여 "call.actionName.before", "call.actionName.after"
 * 이벤트를 관리한다. 이 이벤트는 액션이 실행된 전/후에 호출된다.
 *
 * saram.load([module]); : 모듈 로드
 * saram.use([mName], [mid]); : 모듈 사용
 * saram.weld([mid], [path]); : 루트 pipe에 모듈 연결
 * saram.weld([parentMid], [childMid], [path], [weld]); : 부모모듈에 자식 모듈 연결
 *
 * saram.addReceiver([targetMid], [eventName], [mid], [action]); : targetMid의 eventName의 이벤트가 호출되면 mid의 action을 호출한다.
 */

module.exports = require("./system/kernel/");
