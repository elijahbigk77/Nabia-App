import React, { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardContent, IonButton, IonInput, IonLabel, IonItem, IonText, IonButtons, IonCol, IonRow } from '@ionic/react';
import { addPost, getAllPosts, deletePost, updatePost, PostData } from '../firebaseConfig';
import { toast } from '../toast';
import { getCurrentUser } from '../firebaseConfig';
import MainHeader from '../components/MainHeader';
import MainFooter from '../components/MainFooter';
import './Posts.css';
import { Timestamp } from 'firebase/firestore';

const Posts: React.FC = () => {
    const [posts, setPosts] = useState<PostData[]>([]);
    const [content, setContent] = useState<string>('');
    const [editContent, setEditContent] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [editingPostId, setEditingPostId] = useState<string | null>(null);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    useEffect(() => {
        fetchPosts();
        const user = getCurrentUser();
        if (user) {
            setCurrentUserId(user.uid);
        }
    }, []);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const fetchedPosts = await getAllPosts();
            setPosts(fetchedPosts);
        } catch (error) {
            console.error('Error fetching posts:', error);
            toast('Failed to load posts');
        } finally {
            setLoading(false);
        }
    };

    const handleAddPost = async () => {
        if (!content.trim()) {
            toast('Post content cannot be empty');
            return;
        }

        const currentUser = getCurrentUser();
        if (!currentUser) {
            toast('User not authenticated');
            return;
        }

        const userId = currentUser.uid;
        const displayName = currentUser.displayName || 'User';

        try {
            const success = await addPost({ content, userId, displayName, createdAt: new Timestamp(Timestamp.now().seconds, Timestamp.now().nanoseconds) });
            if (success) {
                setContent('');
                fetchPosts();
                toast('Post added successfully');
            }
        } catch (error) {
            console.error('Error adding post:', error);
            toast('Failed to add post');
        }
    };

    const handleEditPost = async (postId: string) => {
        if (!editContent.trim()) {
            toast('Post content cannot be empty');
            return;
        }

        try {
            const success = await updatePost(postId, { content: editContent });
            if (success) {
                setEditingPostId(null);
                setEditContent('');
                fetchPosts();
                toast('Post updated successfully');
            }
        } catch (error) {
            console.error('Error updating post:', error);
            toast('Failed to update post');
        }
    };

    const handleDeletePost = async (postId: string) => {
        try {
            const success = await deletePost(postId);
            if (success) {
                fetchPosts();
                toast('Post deleted successfully');
            }
        } catch (error) {
            console.error('Error deleting post:', error);
            toast('Failed to delete post');
        }
    };

    return (
        <IonPage>
            <MainHeader />
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Posts</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
            <IonRow>
            <IonCol size="12">
              <div className="form-group">
              <IonLabel position="stacked">Post Content</IonLabel>
              <IonInput className='form-group' value={content} onIonChange={(e) => setContent(e.detail.value!)} placeholder=' Share a post...' />
              </div>
              </IonCol>
              </IonRow>
              
               
                <IonButton expand="full" onClick={handleAddPost} disabled={loading}>
                    {loading ? 'Adding...' : 'Add Post'}
                </IonButton>
                {posts.map(post => (
                    <IonCard key={post.id} className="post-card">
                        <IonCardHeader>
                            <IonTitle color='primary'>{post.displayName}</IonTitle>
                        </IonCardHeader>
                        <IonCardContent>
                            {editingPostId === post.id ? (
                                <>
                                    <IonInput value={editContent} onIonChange={(e) => setEditContent(e.detail.value!)} />
                                    <IonButton color="primary" onClick={() => handleEditPost(post.id)} className="ion-margin-top">
                                        Save
                                    </IonButton>
                                    <IonButton color="secondary" onClick={() => setEditingPostId(null)} className="ion-margin-top">
                                        Cancel
                                    </IonButton>
                                </>
                            ) : (
                                <>
                                    {post.content}
                                    <IonText className="timestamp">
                                        <small>{new Date(post.createdAt.seconds * 1000).toLocaleString()}</small>
                                    </IonText>
                                    {currentUserId === post.userId && (
                                        <IonButtons>
                                            <IonButton color="primary" fill='solid' onClick={() => { setEditingPostId(post.id); setEditContent(post.content); }} className="ion-margin-top edit">
                                                Edit Post
                                            </IonButton>
                                            <IonButton color="danger" fill='solid' onClick={() => handleDeletePost(post.id)} className="ion-margin-top delete">
                                                Delete Post
                                            </IonButton>
                                        </IonButtons>
                                    )}
                                </>
                            )}
                        </IonCardContent>
                    </IonCard>
                ))}
            </IonContent>
            <MainFooter />
        </IonPage>
    );
};

export default Posts;
