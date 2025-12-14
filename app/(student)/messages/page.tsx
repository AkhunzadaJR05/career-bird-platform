import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Phone, Video, Info, Smile, Paperclip, Send, Check, CheckCheck, MessageSquare } from "lucide-react"
import Link from "next/link"
import { ConversationsList } from "@/components/messages/conversations-list"

async function getMessagesData() {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  // Fetch user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name, last_name")
    .eq("user_id", user.id)
    .single()

  // TODO: When messages table is added, fetch real conversations here
  // For now, return empty state - no messages table exists in schema yet
  return {
    conversations: [],
    activeConversation: null,
  }
}

export default async function MessagesPage() {
  const data = await getMessagesData()

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col lg:flex-row">
      {/* Conversations List */}
      <ConversationsList conversations={data.conversations} activeConversationId={null} />

      {/* Active Conversation */}
      {data.activeConversation ? (
        <div className="hidden lg:flex flex-1 flex-col bg-white">
          {/* Conversation Header */}
          <div className="flex items-center justify-between border-b p-3 sm:p-4 flex-shrink-0">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <div className="relative flex-shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-xs sm:text-sm font-semibold text-white">
                  {data.activeConversation.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                {data.activeConversation.verified && (
                  <div className="absolute -right-0.5 -top-0.5 flex h-3 w-3 sm:h-4 sm:w-4 items-center justify-center rounded-full bg-blue-600">
                    <Check className="h-2 w-2 sm:h-3 sm:w-3 text-white" />
                  </div>
                )}
                {data.activeConversation.online && (
                  <div className="absolute bottom-0 right-0 h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full border-2 border-white bg-green-500" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm sm:text-base truncate">{data.activeConversation.name}</h3>
                  {data.activeConversation.verified && (
                    <Badge variant="secondary" className="h-5 text-xs flex-shrink-0">
                      Verified
                    </Badge>
                  )}
                </div>
                {data.activeConversation.title && (
                  <p className="text-xs text-gray-500 truncate">{data.activeConversation.title}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
                <Phone className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
                <Video className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
                <Info className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4">
            {data.activeConversation.messages && data.activeConversation.messages.length > 0 ? (
              <>
                <div className="mb-4 text-center">
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-500">Today</span>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  {data.activeConversation.messages.map((message: any) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}
                    >
                      {message.sender === "them" && (
                        <div className="mr-2 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-xs font-semibold text-white">
                          {data.activeConversation.name
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </div>
                      )}
                      <div className="max-w-[85%] sm:max-w-md">
                        {message.content && (
                          <div
                            className={`rounded-2xl px-3 py-2 sm:px-4 sm:py-2 ${message.sender === "me" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"}`}
                          >
                            <p className="text-xs sm:text-sm leading-relaxed break-words">{message.content}</p>
                          </div>
                        )}
                        {message.file && (
                          <Card className="mt-2 bg-blue-50 p-2 sm:p-3">
                            <div className="flex items-center gap-2 sm:gap-3">
                              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-blue-600 flex-shrink-0">
                                <Paperclip className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs sm:text-sm font-medium text-blue-900 truncate">
                                  {message.file.name}
                                </p>
                                <p className="text-xs text-blue-700">
                                  {message.file.size} • {message.file.type.toUpperCase()}
                                </p>
                              </div>
                            </div>
                          </Card>
                        )}
                        <div className="mt-1 flex items-center gap-1 px-2">
                          <span className="text-xs text-gray-500">{message.timestamp}</span>
                          {message.sender === "me" && (
                            <>
                              {message.read ? (
                                <CheckCheck className="h-3 w-3 text-blue-600 flex-shrink-0" />
                              ) : (
                                <Check className="h-3 w-3 text-gray-400 flex-shrink-0" />
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <MessageSquare className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500 mb-2">No messages in this conversation</p>
                <p className="text-sm text-gray-400">Start the conversation by sending a message</p>
              </div>
            )}
          </div>

          {/* Message Input */}
          <div className="border-t p-3 sm:p-4 flex-shrink-0">
            <div className="flex items-end gap-2 sm:gap-3">
              <Button variant="ghost" size="icon" className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10">
                <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <div className="flex-1 relative">
                <Input
                  placeholder="Type a message..."
                  className="resize-none rounded-2xl border-gray-200 pr-20 sm:pr-24 text-sm"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8">
                    <Smile className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Button
                size="icon"
                className="flex-shrink-0 rounded-full bg-blue-600 hover:bg-blue-700 h-8 w-8 sm:h-10 sm:w-10"
              >
                <Send className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>
            <p className="mt-2 text-center text-xs text-gray-500 hidden sm:block">
              Press Enter to send, Shift + Enter for new line
            </p>
          </div>
        </div>
      ) : (
        <div className="hidden lg:flex flex-1 flex-col items-center justify-center bg-white p-8">
          <div className="text-center">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">Select a conversation to start messaging</p>
            <p className="text-sm text-gray-400">Or start a new conversation from the list</p>
          </div>
        </div>
      )}

      {/* Mobile: Show empty state when no conversation selected */}
      <div className="lg:hidden flex-1 flex items-center justify-center bg-white p-8">
        <div className="text-center">
          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">Select a conversation to start messaging</p>
          <p className="text-sm text-gray-400">Or start a new conversation from the list</p>
        </div>
      </div>
    </div>
  )
}
