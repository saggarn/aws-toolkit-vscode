/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { Memento } from 'vscode'

export const StorageKey = 'NOTIFICATION_INFO_'

export interface NotificationInfoRecord {
    notificationName: string
    viewsCounter: number
    lastSeen: number
    muted: boolean
}

export class NotificationInfoStore {
    constructor(private readonly globalStore: Memento, private readonly workplaceStore: Memento) {}

    public async addRecordToWorkplaceStore(record: NotificationInfoRecord): Promise<void> {
        await this.workplaceStore.update(StorageKey + record.notificationName, record)
    }

    public async addRecordToGlobalStore(record: NotificationInfoRecord): Promise<void> {
        await this.globalStore.update(StorageKey + record.notificationName, record)
    }

    private getEmptyRecord(notificationName: string): NotificationInfoRecord {
        return {
            notificationName,
            viewsCounter: 0,
            lastSeen: 0,
            muted: false,
        }
    }

    public async setMuteStatusInWorkplaceStore(notificationName: string, isMuted: boolean): Promise<void> {
        let record = await this.getRecordFromWorkplaceStore(notificationName)
        if (record === undefined) {
            record = this.getEmptyRecord(notificationName)
        }

        record.muted = isMuted

        await this.workplaceStore.update(StorageKey + notificationName, record)
    }

    public async setMuteStatusInGlobalStore(notificationName: string, isMuted: boolean): Promise<void> {
        let record = await this.getRecordFromGlobalStore(notificationName)
        if (record === undefined) {
            record = this.getEmptyRecord(notificationName)
        }

        record.muted = isMuted

        await this.globalStore.update(StorageKey + notificationName, record)
    }

    public async addNewViewToNotificationInWorkplaceStore(notificationName: string): Promise<void> {
        let record = await this.getRecordFromWorkplaceStore(notificationName)
        if (record === undefined) {
            record = this.getEmptyRecord(notificationName)
        }

        record.viewsCounter = record.viewsCounter + 1
        record.lastSeen = new Date().getTime()

        await this.workplaceStore.update(StorageKey + notificationName, record)
    }

    public async addNewViewToNotificationInGlobalStore(notificationName: string): Promise<void> {
        let record = await this.getRecordFromGlobalStore(notificationName)
        if (record === undefined) {
            record = this.getEmptyRecord(notificationName)
        }

        record.viewsCounter = record.viewsCounter + 1
        record.lastSeen = new Date().getTime()

        await this.globalStore.update(StorageKey + notificationName, record)
    }

    public async getRecordFromGlobalStore(notificationName: string): Promise<NotificationInfoRecord | undefined> {
        return await this.globalStore.get(StorageKey + notificationName)
    }

    public async getRecordFromWorkplaceStore(notificationName: string): Promise<NotificationInfoRecord | undefined> {
        return await this.workplaceStore.get(StorageKey + notificationName)
    }
}
