/**
 * 播放骨骼动画
 *
 * @export
 * @param {cc.Node} node
 * @param {string} anim
 * @param {number} [playTimes=1]
 * @param {...any[]} args
 * @returns {Promise<cc.Event>}
 */
export function playAnimation(node: cc.Node, anim: string, playTimes: number = 1, ...args: any[]): Promise<cc.Event>;
/**
 * 将骨骼动画作为节点方法注入给定节点
 *
 * @export
 * @param {(cc.Node | cc.Node[])} nodes
 * @param {(string[] | Record<string, string>)} anims
 */
export function $verbalize(nodes: cc.Node | cc.Node[], anims: string[] | Record<string, string>);
/**
 * 将龙骨工具函数注入给定节点
 *
 * @export
 * @param {(cc.Node | cc.Node[])} nodes
 * @param {string} [prefix='']
 */
export function $inject(nodes: cc.Node | cc.Node[], prefix: string = '');

/**
 * 注入后节点新增的接口
 *
 * @export
 * @interface NodeEx
 */
export interface NodeEx {
  playAnimation(anim: string, playTimes: number = 1, ...args: any[]): Promise<cc.Event>;
};