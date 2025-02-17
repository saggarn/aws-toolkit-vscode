/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import path from 'path'
import { InitResponseMessage, MessageType, WebviewContext, Command } from '../types'
import { AuthUtil, getChatAuthState } from '../../codewhisperer/util/authUtil'

export async function initMessageHandler(context: WebviewContext) {
    const filePath = context.defaultTemplatePath
    const authState = await getChatAuthState(AuthUtil.instance)

    const responseMessage: InitResponseMessage = {
        messageType: MessageType.RESPONSE,
        command: Command.INIT,
        templateFileName: path.basename(filePath),
        templateFilePath: filePath,
        isConnectedToCodeWhisperer:
            authState.codewhispererChat === 'connected' || authState.codewhispererChat === 'expired',
    }

    context.panel.webview.postMessage(responseMessage)
}
