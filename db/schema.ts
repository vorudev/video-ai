import { integer, text, boolean, pgTable, uuid, real, timestamp, varchar, pgEnum, AnyPgColumn, index, uniqueIndex, decimal} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const roleEnum = pgEnum('role', ['admin', 'user']);

export const subscriptionTierEnum = pgEnum('subscription_tier', ['basic', 'premium']);

export const subscriptionStatusEnum = pgEnum('subscription_status', [
  'active',
  'canceled',
  'expired',
  'trial',
  'past_due',
  'pending'
]);

export const billingIntervalEnum = pgEnum('billing_interval', ['monthly', 'yearly']);

export const paymentStatusEnum = pgEnum('payment_status', [
  'pending',
  'succeeded',
  'canceled',
  'failed',
  'refunded'
]);

export const user = pgTable("user", {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    role: roleEnum('role').default('user').notNull(), // добавляем это поле
     email: text('email').notNull().unique(),
     emailVerified: boolean('email_verified').$defaultFn(() => false).notNull(),
     phoneNumber: text('phone_number').unique(),
     phoneNumberVerified: boolean('phone_number_verified').$defaultFn(() => false).notNull(),
     image: text('image'),
     createdAt: timestamp('created_at').$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
     updatedAt: timestamp('updated_at').$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
     twoFactorEnabled: boolean("two_factor_enabled").notNull().default(false),
    banned: boolean("banned").notNull().default(false), 
    });
export const session = pgTable("session", {
                        id: text('id').primaryKey(),
                        expiresAt: timestamp('expires_at').notNull(),
     token: text('token').notNull().unique(),
     createdAt: timestamp('created_at').notNull(),
     updatedAt: timestamp('updated_at').notNull(),
     ipAddress: text('ip_address'),
     userAgent: text('user_agent'),
     userId: text('user_id').notNull().references(()=> user.id, { onDelete: 'cascade' }),
                    });
    
    export const account = pgTable("account", {
                        id: text('id').primaryKey(),
                        accountId: text('account_id').notNull(),
     providerId: text('provider_id').notNull(),
     userId: text('user_id').notNull().references(()=> user.id, { onDelete: 'cascade' }),
     accessToken: text('access_token'),
     refreshToken: text('refresh_token'),
     idToken: text('id_token'),
     accessTokenExpiresAt: timestamp('access_token_expires_at'),
     refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
     scope: text('scope'),
     password: text('password'),
     createdAt: timestamp('created_at').notNull(),
     updatedAt: timestamp('updated_at').notNull()
                    });
    
    export const verification = pgTable("verification", {
                        id: text('id').primaryKey(),
                        identifier: text('identifier').notNull(),
     value: text('value').notNull(),
     expiresAt: timestamp('expires_at').notNull(),
     createdAt: timestamp('created_at').$defaultFn(() => /* @__PURE__ */ new Date()),
     updatedAt: timestamp('updated_at').$defaultFn(() => /* @__PURE__ */ new Date())
                    });
    export const twoFactor = pgTable("two_factor", {
      id: text("id").primaryKey(),
      secret: text("secret").notNull(),
      backupCodes: text("backup_codes").notNull(),
      userId: text("user_id").notNull().references(()=> user.id, { onDelete: 'cascade' }),
    });

    export const stories = pgTable("stories", { 
      id: uuid("id").primaryKey().defaultRandom(),
      story: text('story').notNull(),
      createdAt: timestamp('created_at').defaultNow().notNull(),
      updatedAt: timestamp('updated_at').defaultNow().notNull()
    })
    
    export const voices = pgTable("voices", { 
      id: uuid("id").primaryKey().defaultRandom(),
      voiceName: text('voiceName').notNull(),
      previewPath: text('voicePath'),
      createdAt: timestamp('created_at').defaultNow().notNull(),
      updatedAt: timestamp('updated_at').defaultNow().notNull()

    })


// Таблица планов подписок


export const files = pgTable('files', {
  id: uuid('id').defaultRandom().primaryKey(),
  
  // Информация о файле в MinIO
  fileName: varchar('file_name', { length: 255 }).notNull(),
  filePath: varchar('file_path', { length: 500 }).notNull(), // полный путь в MinIO
  bucketName: varchar('bucket_name', { length: 100 }).notNull(),
  
  // Метаданные файла
  originalName: varchar('original_name', { length: 255 }).notNull(),
  mimeType: varchar('mime_type', { length: 100 }),
  fileSize: integer('file_size'), // размер в байтах
  
  // Описание и дополнительные поля
  description: text('description'),
  tags: text('tags'), // можно хранить как JSON строку
  
  // Временные метки
  uploadedAt: timestamp('uploaded_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  
});
export const userResult = pgTable('userResult', {
  id: uuid('id').defaultRandom().primaryKey(),

  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),

  fileName: varchar('file_name', { length: 255 }).notNull(),
  filePath: varchar('file_path', { length: 500 }).notNull(),
  fileType: varchar('file_type', { length: 100}).notNull(),

  // Дата, когда файл должен быть удалён
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),

  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  expiresIdx: index('user_result_expires_idx').on(table.expiresAt),
}));

export const subscriptions = pgTable('subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: varchar('user_id', { length: 255 }).notNull().unique(),
  tier: subscriptionTierEnum('tier').notNull().default('basic'),
  status: subscriptionStatusEnum('status').notNull().default('active'),
  
  // Даты подписки
  startedAt: timestamp('started_at').notNull().defaultNow(),
  expiresAt: timestamp('expires_at'), // null для free tier
  canceledAt: timestamp('canceled_at'),
  
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

// Таблица конфигурации тиров (константы лимитов)
export const tierLimits = pgTable('tier_limits', {
  id: uuid('id').primaryKey().defaultRandom(),
  tier: subscriptionTierEnum('tier').notNull().unique(),
  
  // Лимиты
  videosPerDay: integer('video_generations_per_month').notNull(),
  videoDuration: integer('max_video_duration_seconds').notNull(),
  
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

// Таблица использования пользователем (текущий месяц)
export const usageTracking = pgTable('usage_tracking', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  
  // Счетчики за текущий период
  videoGenerationsUsed: integer('video_generations_used').notNull().default(0),
  storageUsedMb: integer('storage_used_mb').notNull().default(0),
  
  // Период отслеживания
  periodStart: timestamp('period_start').notNull().defaultNow(),
  periodEnd: timestamp('period_end'),
  
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})


    export const schema = {
        user, 
        session, 
        account, 
        voices,
        verification,
        files,
        userResult,
        twoFactor,
        stories,
    }
    export type User = typeof user.$inferSelect
    export type Story = typeof stories.$inferSelect
    export type Voice = typeof voices.$inferSelect
    export type File = typeof files.$inferSelect
    export type UserResult = typeof userResult.$inferSelect
    export type UserInfo = typeof usageTracking.$inferSelect
    export type UserSubscription = typeof subscriptions.$inferSelect
    export type TierLimits = typeof tierLimits.$inferSelect