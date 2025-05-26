// 集群环境状态图 - Mermaid.js 代码
const mermaidCode = `
stateDiagram-v2
    title 集群环境状态图
    
    [*] --> 环境创建中
    
    %% 环境交付 - 环境创建状态
    state "环境创建状态" as Creation {
        state 环境创建中 #lightblue
        state 环境创建失败 #mistyrose
        state 集群创建成功 #lightblue
        state 服务部署中 #lightblue
        state 服务部署失败 #mistyrose
        state 服务部署成功 #palegreen
        
        环境创建中 --> 环境创建失败: 创建失败
        环境创建中 --> 集群创建成功: 创建成功
        集群创建成功 --> 服务部署中: 开始部署服务
        服务部署中 --> 服务部署失败: 部署失败
        服务部署中 --> 服务部署成功: 部署成功
        服务部署失败 --> 服务部署中: 重试部署
    }
    
    %% 环境交付 - 环境验证状态
    state "环境验证状态" as Validation {
        state 未验证 #lightgreen
        state 验证中 #lightgreen
        state 验证失败 #mistyrose
        state 验证成功 #palegreen
        
        未验证 --> 验证中: 执行自动化用例
        验证中 --> 验证失败: 验证失败
        验证中 --> 验证成功: 验证成功
        验证失败 --> 验证中: 重新验证
    }
    
    %% 环境使用 - 使用状态
    state "使用状态" as UseState {
        state 未使用 #lightyellow
        state 使用中 #lightyellow
        state 回收中 #lightyellow
        state 已回收 #lightyellow
        
        未使用 --> 使用中: 环境就绪
        使用中 --> 回收中: 开始回收
        回收中 --> 已回收: 回收完成
        回收中 --> 使用中: 回收取消
        已回收 --> 未使用: 重新初始化
    }
    
    %% 环境使用 - 开关机状态
    state "开关机状态" as PowerState {
        state 未开机 #lavender
        state 开机中 #lavender
        state 开机失败 #mistyrose
        state 运行中 #palegreen
        state 关机中 #lavender
        state 关机失败 #mistyrose
        state 已关机 #lavender
        
        未开机 --> 开机中: 用户触发开机
        开机中 --> 开机失败: 开机失败
        开机中 --> 运行中: 开机成功
        运行中 --> 关机中: 开始关机
        关机中 --> 关机失败: 关机失败
        关机中 --> 已关机: 关机成功
        已关机 --> 开机中: 重新开机
        开机失败 --> 开机中: 重试开机
        关机失败 --> 关机中: 重试关机
    }
    
    %% 服务部署成功后的默认状态设置
    服务部署成功 --> 未验证: 设置默认验证状态
    服务部署成功 --> 使用中: 设置为使用中
    服务部署成功 --> 运行中: 设置为运行中
    
    %% 服务部署失败后的默认状态设置
    服务部署失败 --> 未验证: 设置默认验证状态
    服务部署失败 --> 未使用: 设置默认使用状态
    服务部署失败 --> 未开机: 设置默认开关机状态
    
    %% 分区说明
    note right of Creation: 环境交付包含环境创建和环境验证两个子状态
    note right of Validation: 当用户执行自动化用例时，环境验证状态从"未验证"转换为"验证中"
    note right of UseState: 当环境创建状态为服务部署成功时，使用状态自动设置为"使用中"
    note right of PowerState: 当用户触发开机时，开关机状态从"未开机"转换为"开机中"<br>当环境创建状态为服务部署成功时，开关机状态自动设置为"运行中"
    
    %% 状态规则说明
    note right of Creation: 当环境创建状态为非服务部署成功状态时<br>环境验证状态、使用状态和开关机状态分别为默认的<br>"未验证"、"未使用"和"未开机"<br><br>当环境创建状态为服务部署成功状态时<br>环境验证状态、使用状态和开关机状态分别为默认的<br>"未验证"、"使用中"和"运行中"
    
    %% 颜色图例
    state "颜色图例" as Legend {
        state "成功状态" as Success #palegreen
        state "进行中状态" as InProgress #lightblue
        state "失败状态" as Failed #mistyrose
        state "验证状态" as ValidationState #lightgreen
        state "使用状态" as UseStateEx #lightyellow
        state "开关机状态" as PowerStateEx #lavender
    }
`;

// 导出代码以便在其他地方使用
module.exports = mermaidCode;

// 如果在浏览器环境中，可以直接渲染
if (typeof window !== 'undefined' && window.mermaid) {
  window.mermaid.initialize({
    startOnLoad: true,
    theme: 'default',
    securityLevel: 'loose',
  });
}
