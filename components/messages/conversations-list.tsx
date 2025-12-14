"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, MessageSquare, Check } from "lucide-react"
import { MessagesSearch } from "./messages-search"

interface Conversation {
  id: string
  name: string
  title?: string
  lastMessage: string
  timestamp: string
  unread: number
  verified: boolean
  active: boolean
}

interface ConversationsListProps {
  conversations: Conversation[]
  activeConversationId?: string | null
}

export function ConversationsList({ conversations, activeConversationId }: ConversationsListProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) {
      return conversations
    }

    const query = searchQuery.toLowerCase()
    return conversations.filter((conversation) => {
      return (
        conversation.name.toLowerCase().includes(query) ||
        conversation.title?.toLowerCase().includes(query) ||
        conversation.lastMessage.toLowerCase().includes(query)
      )
    })
  }, [conversations, searchQuery])

  return (
    <div className="w-full lg:w-80 border-r bg-white flex flex-col">
      <div className="border-b p-4 shrink-0">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Messages</h2>
          <Button variant="ghost" size="icon" className="shrink-0">
            <Plus className="h-5 w-5" />
          </Button>
        </div>
        <MessagesSearch onSearchChange={setSearchQuery} />
      </div>

      <div className="overflow-y-auto flex-1">
        {filteredConversations.length > 0 ? (
          filteredConversations.map((conversation) => (
            <Link
              key={conversation.id}
              href={`/messages?conversation=${conversation.id}`}
              className={`block border-b p-3 sm:p-4 transition-colors hover:bg-gray-50 ${
                activeConversationId === conversation.id ? "bg-blue-50" : ""
              }`}
            >
              <div className="flex gap-3">
                <div className="relative shrink-0">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-xs sm:text-sm font-semibold text-white">
                    {conversation.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  {conversation.verified && (
                    <div className="absolute -right-0.5 -top-0.5 flex h-3 w-3 sm:h-4 sm:w-4 items-center justify-center rounded-full bg-blue-600">
                      <Check className="h-2 w-2 sm:h-3 sm:w-3 text-white" />
                    </div>
                  )}
                  {conversation.active && (
                    <div className="absolute bottom-0 right-0 h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full border-2 border-white bg-green-500" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate font-medium text-sm sm:text-base">{conversation.name}</p>
                    <span className="shrink-0 text-xs text-gray-500">{conversation.timestamp}</span>
                  </div>
                  {conversation.title && (
                    <p className="truncate text-xs text-gray-500 mt-0.5">{conversation.title}</p>
                  )}
                  <div className="mt-1 flex items-center justify-between gap-2">
                    <p className="truncate text-xs sm:text-sm text-gray-600 flex-1">{conversation.lastMessage}</p>
                    {conversation.unread > 0 && (
                      <Badge className="ml-2 shrink-0 bg-blue-600 text-white text-xs">{conversation.unread}</Badge>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <MessageSquare className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 mb-2">
              {searchQuery ? "No conversations found" : "No messages yet"}
            </p>
            <p className="text-sm text-gray-400">
              {searchQuery
                ? "Try adjusting your search"
                : "Start a conversation with a professor or mentor"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
